import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { deleteTodo, getTodos, postTodo } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorMessage } from './components/todos/ErrorMessage';
import { Footer } from './components/todos/Footer';
import { Header } from './components/todos/Header';
import { TodoList } from './components/todos/TodoList';
import { Error } from './types/Error';
import { Status } from './types/Status';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const user = useContext(AuthContext);

  const [error, setError] = useState(Error.None);

  const [isAdding, setIsAdding] = useState(false);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [status, setStatus] = useState<Status>(Status.All);
  const [removedTodos, setRemovedTodos] = useState<number[]>([]);

  const loadData = async () => {
    if (user) {
      const temp = await getTodos(user.id);

      setTodos(temp);
      setVisibleTodos(temp);
      setTempTodo(null);
    }
  };

  const filterTodosByStatus = (activedStatus: string): Todo[] => {
    switch (activedStatus) {
      case 'Active':
        return todos.filter(todo => !todo.completed);

      case 'Completed':
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setVisibleTodos(filterTodosByStatus(status));
  }, [status, todos]);

  const addTodo = useCallback(async (value: string) => {
    if (!value.trim()) {
      setError(Error.Empty);

      return;
    }

    setIsAdding(true);

    if (user && value) {
      setTempTodo({
        id: 0,
        userId: user.id,
        title: value,
        completed: false,
      });
      await postTodo(user.id, value);
      loadData();
    } else {
      setError(Error.Add);
    }

    setIsAdding(false);
  }, []);

  const removeTodo = useCallback(async (id: number) => {
    try {
      await deleteTodo(id);
    } catch {
      setError(Error.Delete);
    }

    loadData();
  }, []);

  const removeCompleted = async (completedTodos: Todo[]) => {
    const completedTodoIds = completedTodos.map(todo => todo.id);

    setRemovedTodos(completedTodoIds);

    await Promise.all(
      completedTodos.map(async (todo) => {
        await removeTodo(todo.id);
      }),
    );
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          addTodo={addTodo}
          isAdding={isAdding}
        />

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          removeTodo={removeTodo}
          removedTodos={removedTodos}
          setRemovedTodos={setRemovedTodos}
        />

        {todos.length > 0 && (
          <Footer
            todos={todos}
            selected={status}
            setStatus={setStatus}
            removeCompleted={removeCompleted}
          />
        )}

      </div>

      {error !== Error.None && (
        <ErrorMessage
          error={error}
          setError={setError}
        />
      )}
    </div>
  );
};
