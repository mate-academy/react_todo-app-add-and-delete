import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { FilterType } from './types/FilterType';
import { addTodo, getTodos, removeTodo } from './api/todos';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Notifications } from './components/Notifications/Notifications';
import { ErrorType } from './types/ErrorType';
import { NewTodo } from './types/NewTodo';
import { USER_ID } from './components/USER_ID';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [hasError, setHasError] = useState<ErrorType>(ErrorType.NONE);
  const [filterType, setFilterType] = useState<FilterType>(FilterType.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodo, setLoadingTodo] = useState<number[]>([0]);
  const [isLoading, setIsLoading] = useState(false);

  const completedTodos = useMemo(
    () => todos.filter(todo => todo.completed), [todos],
  );

  const activeTodos = useMemo(
    () => todos.filter(todo => !todo.completed), [todos],
  );

  const filterTodos = useMemo(() => {
    return todos.filter((todo) => {
      switch (filterType) {
        case FilterType.All:
          return true;
        case FilterType.Active:
          return !todo.completed;
        case FilterType.Completed:
          return todo.completed;
        default:
          return false;
      }
    });
  }, [todos, filterType]);

  const showError = (error: ErrorType) => {
    setHasError(error);
    setTimeout(() => {
      setHasError(ErrorType.NONE);
    }, 3000);
  };

  const handleAddTodo = useCallback(async (newTodo: NewTodo) => {
    setIsLoading(true);
    setHasError(ErrorType.NONE);

    if (!newTodo.title.trim()) {
      showError(ErrorType.EMPTY_TITLE);

      return;
    }

    addTodo(newTodo)
      .then((data) => {
        setTodos((prevTodos) => [...prevTodos, data]);
      })
      .catch(() => {
        showError(ErrorType.ADD);
      })
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
      });
  }, []);

  const handleRemoveTodo = useCallback(async (todoId: number) => {
    setHasError(ErrorType.NONE);
    setLoadingTodo((prevTodo) => [...prevTodo, todoId]);
    try {
      await removeTodo(todoId);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== todoId));
    } catch {
      setHasError(ErrorType.DELETE);
    }
  }, []);

  const handleClearCompleted = () => {
    setIsLoading(true);

    const completedTodoIds = completedTodos
      .filter(todo => todo.id !== undefined)
      .map(todo => todo.id);

    Promise.all(
      completedTodoIds.map(todoId => handleRemoveTodo(todoId)),
    )
      .then(() => {
        setTodos(activeTodos);
      })
      .catch(() => {
        showError(ErrorType.DELETE);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getTodos(USER_ID).then(data => setTodos(data))
      .catch(() => {
        setHasError(ErrorType.LOAD);
      });
  });

  const handleCloseError = useCallback(() => {
    setHasError(ErrorType.NONE);
  }, []);

  const handleFilter = (filter: FilterType) => (
    event: React.MouseEvent<HTMLAnchorElement>,
  ) => {
    event.preventDefault();
    setFilterType(filter);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          isActive={activeTodos.length > 0}
          onSubmit={handleAddTodo}
          isLoading={isLoading}
        />

        <TodoList
          todos={filterTodos}
          removeTodo={handleRemoveTodo}
          loadingTodo={loadingTodo}
          tempTodo={tempTodo}
        />

        {todos.length > 0 && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              {`${activeTodos.length} items left`}
            </span>

            <nav className="filter">
              <a
                href="#/"
                className={classNames(
                  'filter__link',
                  { selected: filterType === FilterType.All },
                )}
                onClick={handleFilter(FilterType.All)}
              >
                {FilterType.All}
              </a>

              <a
                href="#/active"
                className={classNames(
                  'filter__link',
                  { selected: filterType === FilterType.Active },
                )}
                onClick={handleFilter(FilterType.Active)}
              >
                {FilterType.Active}
              </a>

              <a
                href="#/completed"
                className={classNames(
                  'filter__link',
                  { selected: filterType === FilterType.Completed },
                )}
                onClick={handleFilter(FilterType.Completed)}
              >
                {FilterType.Completed}
              </a>
            </nav>

            {completedTodos.length > 0 && (
              <button
                type="button"
                className="todoapp__clear-completed"
                onClick={handleClearCompleted}
              >
                Clear completed
              </button>
            )}

          </footer>
        )}
      </div>

      {hasError && (
        <Notifications
          error={hasError}
          onCloseError={handleCloseError}
        />
      )}
    </div>
  );
};

export { USER_ID };
