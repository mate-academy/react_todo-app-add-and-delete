/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useMemo,
  useEffect,
  useState,
} from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { createTodo, deleteTodo, getTodos } from './api/todos';
import { TodoList } from './components/TodoList';
import { TodoForm } from './components/TodoForm';
import { Error } from './components/Error';
import { Filters } from './types/Filters';
import { Filter } from './components/Filter';

const USER_ID = 10892;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState(Filters.ALL);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodo, setLoadingTodo] = useState([0]);

  useEffect(() => {
    getTodos(USER_ID)
      .then((todosFromServer) => setTodos(todosFromServer))
      .catch(() => setError('Unable to load todos'));
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (error) {
      timeout = setTimeout(() => {
        setError(null);
      }, 3000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [error]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const uncompletedTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case Filters.COMPLETED:
        return completedTodos;

      case Filters.ACTIVE:
        return uncompletedTodos;

      default:
        return todos;
    }
  }, [todos, filter]);

  const handleCloseError = () => {
    setError(null);
  };

  const addTodo = async (title: string) => {
    try {
      const newTodo = {
        userId: USER_ID,
        completed: false,
        title,
      };

      setTempTodo({
        id: 0,
        ...newTodo,
      });

      const createdTodo = await createTodo(newTodo);

      setTodos((prevTodos) => [...prevTodos, createdTodo]);
    } catch {
      setError('Unable to add a todo');
    } finally {
      setTempTodo(null);
    }
  };

  const showTitleError = (erorMessage: string) => {
    setError(erorMessage);
  };

  const removeTodo = async (todoId: number) => {
    try {
      setLoadingTodo(prevTodoId => [...prevTodoId, todoId]);
      await deleteTodo(todoId);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
    } catch {
      setError('Unable to delete a todo');
    } finally {
      setTempTodo(null);
      setLoadingTodo([0]);
    }
  };

  const handleclearCompletedTodo = () => {
    completedTodos.forEach(async (todo) => {
      await removeTodo(todo.id);
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}
          <button type="button" className="todoapp__toggle-all active" />
          <TodoForm
            onAddTodo={addTodo}
            onShowInputError={showTitleError}
          />
        </header>

        <TodoList
          todos={filteredTodos}
          onRemoveTodo={removeTodo}
          tempTodo={tempTodo}
          loadingTodo={loadingTodo}
        />

        {todos.length > 0 && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              {`${uncompletedTodos.length} items left`}
            </span>

            <Filter filter={filter} onChangeFilter={setFilter} />

            {completedTodos && (
              <button
                type="button"
                className="todoapp__clear-completed"
                onClick={handleclearCompletedTodo}
              >
                Clear completed
              </button>
            )}
          </footer>
        )}
      </div>

      <Error error={error} onCloseError={handleCloseError} />
    </div>
  );
};
