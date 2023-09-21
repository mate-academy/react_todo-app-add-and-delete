import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import cn from 'classnames';
import { UserWarning } from './UserWarning';
import { getTodos, addTodo, deleteTodo } from './api/todos';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { FilterTodos } from './components/FilterTodos/FilterTodos';
import { Todo } from './types/Todo';
import { Error } from './types/Error';
// eslint-disable-next-line max-len
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';
import { FilterOption } from './types/Filter';

const USER_ID = 10918;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>(FilterOption.ALL);
  const [title, setTitle] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodo, setLoadingTodo] = useState<number[]>([]);

  const todosCount = todos.length;

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch((errorFromServer) => {
        setError(errorFromServer.message || Error.Loading);
      });
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

  const createTodo = useCallback(async (newTodoTitle: string) => {
    setLoadingTodo([0]);
    const normalizeNewTodoTitle = newTodoTitle.trim();

    if (!normalizeNewTodoTitle) {
      setError(Error.NoTitle);
    }

    if (normalizeNewTodoTitle) {
      try {
        const newTodo = {
          title: normalizeNewTodoTitle,
          completed: false,
          userId: USER_ID,
        };

        setTempTodo({
          id: 0,
          ...newTodo,
        });

        const createdTodo = await addTodo(newTodo);

        setTodos((prevTodos) => [...prevTodos, createdTodo]);
      } catch {
        setError(Error.Add);
      } finally {
        setTempTodo(null);
        setTitle('');
        setLoadingTodo([]);
      }
    }
  }, [USER_ID, todos]);

  const removeTodo = useCallback(async (todoId: number) => {
    try {
      setLoadingTodo((prev) => [...prev, todoId]);

      const isDeleted = await deleteTodo(todoId);

      if (isDeleted) {
        setTodos((prevTodos) => {
          return prevTodos.filter(todo => (
            todo.id !== todoId));
        });
      }
    } catch {
      setError(Error.Delete);
    } finally {
      setLoadingTodo([]);
    }
  }, []);

  const closeNotification = useCallback(() => {
    setError(null);
  }, []);

  const visibleTodos = useMemo(() => {
    switch (filter) {
      case FilterOption.ACTIVE:
        return todos.filter(todo => !todo.completed);
      case FilterOption.COMPLETED:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const completedTodos = todos.filter(todo => todo.completed);

  const deleteCompletedTodos = () => {
    const filterCompletedTodos = todos.filter(todo => todo.completed);

    filterCompletedTodos.forEach(todo => removeTodo(todo.id));
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todosCount={todosCount}
          title={title}
          setTitle={setTitle}
          createTodo={createTodo}
          setError={setError}
          loadingTodo={loadingTodo}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              tempTodo={tempTodo}
              todos={visibleTodos}
              removeTodo={removeTodo}
              loadingTodo={loadingTodo}
            />

            <footer className="todoapp__footer">
              <span className="todo-count">
                {`${todosCount} items left`}
              </span>

              <FilterTodos
                filter={filter}
                setFilter={setFilter}
              />

              <button
                type="button"
                className={cn('todoapp__clear-completed', {
                  'todoapp__clear-hide': completedTodos.length <= 0,
                })}
                disabled={completedTodos.length <= 0}
                onClick={deleteCompletedTodos}
              >
                Clear completed
              </button>

            </footer>
          </>
        )}

      </div>

      {error && (
        <ErrorNotification
          error={error}
          closeNotification={closeNotification}
        />
      )}
    </div>
  );
};
