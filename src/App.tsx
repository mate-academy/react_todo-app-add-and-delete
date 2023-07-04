import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import cn from 'classnames';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { createTodo, deleteTodoRequest, getTodos } from './api/todos';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Notification } from './components/Notification/Notification';
import { TodoFilter } from './components/TodoFilter/TodoFilter';
import { TodoItem } from './components/TodoItem';

const USER_ID = 10919;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(false);

  const hasCompletedTodos = todos.some(todo => todo.completed);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setError('Unable to load todos'));
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setError(null);
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, [error]);

  const visibleTodos = useMemo(() => {
    switch (filter) {
      case 'All':
        return todos;
      case 'Active':
        return todos.filter(todo => !todo.completed);
      case 'Completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const addNewTodo = useCallback(async (newTitle:string) => {
    try {
      const newTodo = {
        title: newTitle,
        userId: USER_ID,
        completed: false,
      };

      setIsLoading(true);

      const createdTodo = await createTodo(USER_ID, newTodo);

      setTempTodo({
        id: 0,
        title: newTitle,
        userId: USER_ID,
        completed: false,
      });

      setTodos((prevTodos) => [
        ...prevTodos,
        createdTodo,
      ]);
    } catch {
      setError('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setIsLoading(false);
    }
  }, []);

  const deleteTodo = useCallback(async (todoId:number) => {
    try {
      setIsLoading(true);

      const isDeleted = await deleteTodoRequest(todoId);

      if (isDeleted) {
        setTodos(prevTodos => {
          return prevTodos.filter(todo => todo.id !== todoId);
        });
      }
    } catch {
      setError('Unable to delete a todo');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearCompletedTodos = async () => {
    try {
      setIsLoading(true);

      const completedTodoIds = todos
        .filter(todo => todo.completed)
        .map(todo => todo.id);

      const deletePromises = completedTodoIds.map(todoId => deleteTodo(todoId));

      await Promise.all(deletePromises);

      setTodos(prevTodos => prevTodos
        .filter(todo => !completedTodoIds.includes(todo.id)));

      setIsLoading(false);
    } catch {
      setError('Unable to clear completed todos');
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setError={setError}
          addNewTodo={addNewTodo}
          isLoading={isLoading}
          hasCompletedTodos={hasCompletedTodos}
        />

        {todos && (
          <TodoList
            todos={visibleTodos}
            isLoading={isLoading}
            deleteTodo={deleteTodo}
          />
        )}
        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            isLoading={isLoading}
            deleteTodo={deleteTodo}
          />
        )}

        {todos.length > 0 && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              {`${todos.length} items left`}
            </span>

            <TodoFilter
              filter={filter}
              setFilter={setFilter}
            />

            <button
              type="button"
              className={cn({
                'todoapp__clear-completed': hasCompletedTodos,
                'todoapp__clear-hidden': !hasCompletedTodos,
              })}
              onClick={clearCompletedTodos}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>
      {error && (
        <Notification error={error} setError={setError} />
      )}
    </div>
  );
};
