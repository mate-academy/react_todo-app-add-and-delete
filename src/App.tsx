/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';

import { UserWarning } from './UserWarning';
import { USER_ID, getTodos, addTodo, deleteTodo, Todo } from './api/todos';

type FilterStatus = 'all' | 'active' | 'completed';

const ERROR_MESSAGES = {
  load: 'Unable to load todos',
  add: 'Unable to add a todo',
  delete: 'Unable to delete a todo',
  update: 'Unable to update a todo',
  empty: 'Title should not be empty',
} as const;

function getFilterFromHash(): FilterStatus {
  const hash = window.location.hash.replace('#/', '');

  switch (hash) {
    case 'active':
      return 'active';
    case 'completed':
      return 'completed';
    default:
      return 'all';
  }
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterStatus>('all');

  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [loadingTodoIds, setLoadingTodoIds] = useState<Set<number>>(
    () => new Set(),
  );

  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  useEffect(() => {
    if (!isLoading && !isAdding) {
      focusInput();
    }
  }, [isLoading, isAdding]);

  useEffect(() => {
    const onHashChange = () => setFilter(getFilterFromHash());

    onHashChange();
    window.addEventListener('hashchange', onHashChange);

    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    if (!error) {
      return;
    }

    const timerId = window.setTimeout(() => {
      setError('');
    }, 3000);

    return () => window.clearTimeout(timerId);
  }, [error]);

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    let cancelled = false;

    setError('');
    setIsLoading(true);

    getTodos()
      .then(loadedTodos => {
        if (cancelled) {
          return;
        }

        setTodos(loadedTodos);
      })
      .catch(() => {
        if (cancelled) {
          return;
        }

        setError(ERROR_MESSAGES.load);
      })
      .finally(() => {
        if (cancelled) {
          return;
        }

        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const activeCount = useMemo(
    () => todos.filter(t => !t.completed).length,
    [todos],
  );

  const completedCount = todos.length - activeCount;

  const allCompleted = todos.length > 0 && activeCount === 0;
  const hasTodos = todos.length > 0;

  const visibleTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter(t => !t.completed);
      case 'completed':
        return todos.filter(t => t.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const isInputDisabled = isLoading || isAdding;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = newTitle.trim();

    if (!trimmedTitle) {
      setError(ERROR_MESSAGES.empty);
      focusInput();

      return;
    }

    setError('');
    setIsAdding(true);

    const temp: Todo = {
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo(temp);

    addTodo({
      title: trimmedTitle,
      userId: USER_ID,
      completed: false,
    })
      .then(createdTodo => {
        setTodos(prev => [...prev, createdTodo]);
        setNewTitle('');
      })
      .catch(() => {
        setError(ERROR_MESSAGES.add);
      })
      .finally(() => {
        setTempTodo(null);
        setIsAdding(false);
        focusInput();
      });
  };

  const handleDelete = (todoId: number) => {
    setError('');

    setLoadingTodoIds(prev => {
      const next = new Set(prev);

      next.add(todoId);

      return next;
    });

    deleteTodo(todoId)
      .then(() => {
        setTodos(prev => prev.filter(t => t.id !== todoId));
      })
      .catch(() => {
        setError(ERROR_MESSAGES.delete);
      })
      .finally(() => {
        setLoadingTodoIds(prev => {
          const next = new Set(prev);

          next.delete(todoId);

          return next;
        });

        focusInput();
      });
  };

  const handleClearCompleted = () => {
    const idsToDelete = todos.filter(t => t.completed).map(t => t.id);

    if (idsToDelete.length === 0) {
      return;
    }

    setError('');

    setLoadingTodoIds(prev => {
      const next = new Set(prev);

      idsToDelete.forEach(id => next.add(id));

      return next;
    });

    Promise.allSettled(idsToDelete.map(id => deleteTodo(id)))
      .then(results => {
        const successIds: number[] = [];

        results.forEach((res, index) => {
          if (res.status === 'fulfilled') {
            successIds.push(idsToDelete[index]);
          }
        });

        if (successIds.length > 0) {
          setTodos(prev => prev.filter(t => !successIds.includes(t.id)));
        }

        const hasAnyFail = results.some(r => r.status === 'rejected');

        if (hasAnyFail) {
          setError(ERROR_MESSAGES.delete);
        }
      })
      .finally(() => {
        setLoadingTodoIds(prev => {
          const next = new Set(prev);

          idsToDelete.forEach(id => next.delete(id));

          return next;
        });

        focusInput();
      });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const shouldShowList = hasTodos || tempTodo !== null;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={classNames('todoapp__toggle-all', {
              active: allCompleted,
            })}
            data-cy="ToggleAllButton"
            onClick={() => {}}
            disabled={!hasTodos || isLoading}
          />

          <form onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              autoFocus
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              disabled={isInputDisabled}
            />
          </form>
        </header>

        {shouldShowList && (
          <section className="todoapp__main" data-cy="TodoList">
            {visibleTodos.map(todo => {
              const isTodoLoading = loadingTodoIds.has(todo.id);

              return (
                <div
                  key={todo.id}
                  data-cy="Todo"
                  className={classNames('todo', { completed: todo.completed })}
                >
                  <label className="todo__status-label">
                    <input
                      data-cy="TodoStatus"
                      type="checkbox"
                      className="todo__status"
                      checked={todo.completed}
                      onChange={() => {}}
                      disabled={isTodoLoading}
                    />
                  </label>

                  <span data-cy="TodoTitle" className="todo__title">
                    {todo.title}
                  </span>

                  <button
                    type="button"
                    className="todo__remove"
                    data-cy="TodoDelete"
                    onClick={() => handleDelete(todo.id)}
                    disabled={isTodoLoading}
                  >
                    ×
                  </button>

                  <div
                    data-cy="TodoLoader"
                    className={classNames('modal overlay', {
                      'is-active': isTodoLoading,
                    })}
                  >
                    <div
                      className="modal-background has-background-white-ter"
                      aria-hidden
                    />
                    <div className="loader" />
                  </div>
                </div>
              );
            })}

            {tempTodo && (
              <div data-cy="Todo" className="todo">
                <label className="todo__status-label">
                  <input
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                    disabled
                  />
                </label>

                <span data-cy="TodoTitle" className="todo__title">
                  {tempTodo.title}
                </span>

                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  disabled
                >
                  ×
                </button>

                <div data-cy="TodoLoader" className="modal overlay is-active">
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            )}
          </section>
        )}

        {hasTodos && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeCount} item{activeCount === 1 ? '' : 's'} left
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={classNames('filter__link', {
                  selected: filter === 'all',
                })}
                data-cy="FilterLinkAll"
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames('filter__link', {
                  selected: filter === 'active',
                })}
                data-cy="FilterLinkActive"
              >
                Active
              </a>

              <a
                href="#/completed"
                className={classNames('filter__link', {
                  selected: filter === 'completed',
                })}
                data-cy="FilterLinkCompleted"
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={completedCount === 0}
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
          { hidden: !error },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError('')}
        />
        {error}
      </div>
    </div>
  );
};
