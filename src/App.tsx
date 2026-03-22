/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { createTodo, getTodos, removeTodo, USER_ID } from './api/todos';
import { Todo } from './types/Todo';

enum FilterStatus {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

const ERROR_HIDE_DELAY = 3000;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const [processingIds, setProcessingIds] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const errorTimerRef = useRef<number | null>(null);

  const clearErrorTimer = useCallback(() => {
    if (errorTimerRef.current) {
      window.clearTimeout(errorTimerRef.current);
      errorTimerRef.current = null;
    }
  }, []);

  const hideError = useCallback(() => {
    clearErrorTimer();
    setIsErrorVisible(false);
  }, [clearErrorTimer]);

  const showError = useCallback(
    (message: string) => {
      clearErrorTimer();
      setErrorMessage(message);
      setIsErrorVisible(true);

      errorTimerRef.current = window.setTimeout(() => {
        setIsErrorVisible(false);
      }, ERROR_HIDE_DELAY);
    },
    [clearErrorTimer],
  );

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    focusInput();
  }, [focusInput]);

  useEffect(() => {
    hideError();

    getTodos()
      .then(setTodos)
      .catch(() => {
        showError('Unable to load todos');
      });

    return () => {
      clearErrorTimer();
    };
  }, [clearErrorTimer, hideError, showError]);

  const visibleTodos = useMemo(() => {
    switch (filter) {
      case FilterStatus.Active:
        return todos.filter(todo => !todo.completed);

      case FilterStatus.Completed:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  }, [todos, filter]);

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodos = todos.filter(todo => todo.completed);
  const hasTodos = todos.length > 0;
  const isAdding = tempTodo !== null;

  const handleAddTodo = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    hideError();

    const trimmedTitle = query.trim();

    if (!trimmedTitle) {
      showError('Title should not be empty');
      focusInput();

      return;
    }

    const newTodo = {
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo({
      id: 0,
      ...newTodo,
    });

    createTodo(newTodo)
      .then(createdTodo => {
        setTodos(currentTodos => [...currentTodos, createdTodo]);
        setQuery('');
      })
      .catch(() => {
        showError('Unable to add a todo');
      })
      .finally(() => {
        setTempTodo(null);

        setTimeout(() => {
          focusInput();
        }, 0);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    hideError();
    setProcessingIds(currentIds => [...currentIds, todoId]);

    removeTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        showError('Unable to delete a todo');
      })
      .finally(() => {
        setProcessingIds(currentIds =>
          currentIds.filter(currentId => currentId !== todoId),
        );

        setTimeout(() => {
          focusInput();
        }, 0);
      });
  };

  const handleClearCompleted = () => {
    hideError();
    completedTodos.forEach(todo => handleDeleteTodo(todo.id));
  };

  const renderTodo = (todo: Todo, isTemporary = false) => {
    const isProcessing = isTemporary || processingIds.includes(todo.id);

    return (
      <div
        key={isTemporary ? 'temp-todo' : todo.id}
        data-cy="Todo"
        className={classNames('todo', {
          completed: todo.completed,
        })}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
            readOnly
            aria-label="Todo status"
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          {todo.title}
        </span>

        {!isTemporary && (
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDeleteTodo(todo.id)}
          >
            ×
          </button>
        )}

        <div
          data-cy="TodoLoader"
          className={classNames('modal overlay', {
            'is-active': isProcessing,
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    );
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        {hasTodos && (
          <button
            type="button"
            className={classNames('todoapp__toggle-all', {
              active: activeTodosCount === 0,
            })}
            data-cy="ToggleAllButton"
          />
        )}

        <form onSubmit={handleAddTodo}>
          <input
            ref={inputRef}
            data-cy="NewTodoField"
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            value={query}
            onChange={event => setQuery(event.target.value)}
            disabled={isAdding}
          />
        </form>

        {(hasTodos || tempTodo) && (
          <section className="todoapp__main">
            {visibleTodos.map(todo => renderTodo(todo))}
            {tempTodo && renderTodo(tempTodo, true)}
          </section>
        )}

        {hasTodos && (
          <footer className="todoapp__footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${activeTodosCount} item${activeTodosCount === 1 ? '' : 's'} left`}
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                data-cy="FilterLinkAll"
                className={classNames('filter__link', {
                  selected: filter === FilterStatus.All,
                })}
                onClick={event => {
                  event.preventDefault();
                  setFilter(FilterStatus.All);
                }}
              >
                All
              </a>

              <a
                href="#/active"
                data-cy="FilterLinkActive"
                className={classNames('filter__link', {
                  selected: filter === FilterStatus.Active,
                })}
                onClick={event => {
                  event.preventDefault();
                  setFilter(FilterStatus.Active);
                }}
              >
                Active
              </a>

              <a
                href="#/completed"
                data-cy="FilterLinkCompleted"
                className={classNames('filter__link', {
                  selected: filter === FilterStatus.Completed,
                })}
                onClick={event => {
                  event.preventDefault();
                  setFilter(FilterStatus.Completed);
                }}
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={completedTodos.length === 0}
              onClick={handleClearCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !isErrorVisible,
          },
        )}
      >
        <button
          type="button"
          className="delete"
          data-cy="HideErrorButton"
          onClick={hideError}
          aria-label="Hide error"
        />

        {errorMessage}
      </div>
    </div>
  );
};
