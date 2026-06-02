/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import * as postService from './api/todos';
import { Todo } from './types/Todo';
import classNames from 'classnames';

enum FilterStatus {
  All = '',
  Active = 'active',
  Completed = 'completed',
}

enum ErrorMessage {
  Load = 'Unable to load todos',
  Add = 'Unable to add a todo',
  Delete = 'Unable to delete a todo',
  Update = 'Unable to update a todo',
  EmptyTitle = 'Title should not be empty',
}

export const App: React.FC = () => {
  const [filter, setFilter] = useState(FilterStatus.All);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [processingIds, setProcessingIds] = useState<number[]>([]);

  useEffect(() => {
    setErrorMessage(null);

    postService
      .getTodos()
      .then(loadedTodos => {
        setTodos(loadedTodos);
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Load);
      });
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timer = setTimeout(() => {
      setErrorMessage(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [todos, isAdding, tempTodo]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const activeTodosCount = todos.filter(t => !t.completed).length;
  const hasCompletedTodos = todos.some(t => t.completed);

  const filteredTodos = todos.filter(todo => {
    if (filter === FilterStatus.Active) {
      return !todo.completed;
    }

    if (filter === FilterStatus.Completed) {
      return todo.completed;
    }

    return true;
  });

  const addTodo = (title: string) => {
    const trimmedTitle = title.trim();

    if (!title.trim()) {
      setErrorMessage(ErrorMessage.EmptyTitle);

      return;
    }

    setIsAdding(true);

    setTempTodo({
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    });

    postService
      .createTodo(trimmedTitle)
      .then(newTodo => {
        setTodos(current => [...current, newTodo]);
        setInputValue('');
        inputRef.current?.focus();
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Add);
      })
      .finally(() => {
        setTempTodo(null);
        setIsAdding(false);
      });
  };

  function deleteTodo(todoId: number) {
    setProcessingIds(current => [...current, todoId]);

    postService
      .deletePost(todoId)
      .then(() => {
        setTodos(current => current.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Delete);
      })
      .finally(() => {
        setProcessingIds(current => current.filter(pid => pid !== todoId));
      });
  }

  const toggleTodo = (todo: Todo) => {
    setProcessingIds(current => [...current, todo.id]);

    postService
      .updatePost(todo.id, { completed: !todo.completed })
      .then((updatedTodo: Todo) => {
        setTodos(current =>
          current.map(t => (t.id === todo.id ? updatedTodo : t)),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Update);
      })
      .finally(() => {
        setProcessingIds(current => current.filter(pid => pid !== todo.id));
      });
  };

  const toggleAll = () => {
    const shouldCompleteAll = activeTodosCount > 0;

    todos.forEach(odo => {
      if (odo.completed !== shouldCompleteAll) {
        setProcessingIds(current => [...current, odo.id]);

        postService
          .updatePost(odo.id, { completed: shouldCompleteAll })
          .then((updatePost: Todo) => {
            setTodos(current =>
              current.map(t => (t.id === odo.id ? updatePost : t)),
            );
          })
          .catch(() => {
            setErrorMessage(ErrorMessage.Update);
          })
          .finally(() => {
            setProcessingIds(current => current.filter(pid => pid !== odo.id));
          });
      }
    });
  };

  const clearCompleted = () => {
    const completedIds = todos.filter(tod => tod.completed).map(tod => tod.id);

    setProcessingIds(current => [...current, ...completedIds]);

    const deletePromises = completedIds.map(todoId =>
      postService
        .deletePost(todoId)
        .then(() => ({ todoId, success: true }))
        .catch(() => ({ todoId, success: false })),
    );

    Promise.all(deletePromises).then(results => {
      const successfulIds = results
        .filter(res => res.success)
        .map(res => res.todoId);

      const hasError = results.some(res => !res.success);

      if (hasError) {
        setErrorMessage(ErrorMessage.Delete);
      }

      setTodos(current =>
        current.filter(todo => !successfulIds.includes(todo.id)),
      );

      setProcessingIds(current =>
        current.filter(pid => !completedIds.includes(pid)),
      );
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: activeTodosCount === 0,
              })}
              data-cy="ToggleAllButton"
              onClick={toggleAll}
            />
          )}

          <form
            onSubmit={e => {
              e.preventDefault();
              addTodo(inputValue);
            }}
          >
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              disabled={isAdding}
              autoFocus
            />
          </form>
        </header>

        {(todos.length > 0 || tempTodo) && (
          <>
            <section className="todoapp__main" data-cy="TodoList">
              {filteredTodos.map(tdo => {
                const isProcessing = processingIds.includes(tdo.id);

                return (
                  <div
                    key={tdo.id}
                    data-cy="Todo"
                    className={classNames('todo', {
                      completed: tdo.completed,
                      'is-active': isProcessing,
                    })}
                  >
                    <label className="todo__status-label">
                      <input
                        data-cy="TodoStatus"
                        type="checkbox"
                        className="todo__status"
                        checked={tdo.completed}
                        onChange={() => toggleTodo(tdo)}
                        disabled={isProcessing}
                      />
                    </label>

                    <span data-cy="TodoTitle" className="todo__title">
                      {tdo.title}
                    </span>

                    <button
                      type="button"
                      className="todo__remove"
                      data-cy="TodoDelete"
                      onClick={() => deleteTodo(tdo.id)}
                      disabled={isProcessing}
                    >
                      ×
                    </button>

                    <div
                      data-cy="TodoLoader"
                      className={classNames('modal', 'overlay', {
                        'is-active': isProcessing,
                      })}
                    >
                      <div className="modal-background has-background-white-ter" />
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

                  <button type="button" className="todo__remove" disabled>
                    ×
                  </button>

                  <div data-cy="TodoLoader" className="modal overlay is-active">
                    <div className="modal-background has-background-white-ter" />
                    <div className="loader" />
                  </div>
                </div>
              )}
            </section>

            {/* Hide the footer if there are no todos */}
            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="TodosCounter">
                {activeTodosCount} items left
              </span>

              {/* Active link should have the 'selected' class */}
              <nav className="filter" data-cy="Filter">
                <a
                  href="#/"
                  className={classNames('filter__link', {
                    selected: filter === FilterStatus.All,
                  })}
                  data-cy="FilterLinkAll"
                  onClick={() => setFilter(FilterStatus.All)}
                >
                  All
                </a>

                <a
                  href="#/active"
                  className={classNames('filter__link', {
                    selected: filter === FilterStatus.Active,
                  })}
                  data-cy="FilterLinkActive"
                  onClick={() => setFilter(FilterStatus.Active)}
                >
                  Active
                </a>

                <a
                  href="#/completed"
                  className={classNames('filter__link', {
                    selected: filter === FilterStatus.Completed,
                  })}
                  data-cy="FilterLinkCompleted"
                  onClick={() => setFilter(FilterStatus.Completed)}
                >
                  Completed
                </a>
              </nav>

              {/* this button should be disabled if there are no completed todos */}
              <button
                type="button"
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
                disabled={!hasCompletedTodos}
                onClick={clearCompleted}
              >
                Clear completed
              </button>
            </footer>
          </>
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage(null)}
        />
        {errorMessage}
      </div>
    </div>
  );
};
