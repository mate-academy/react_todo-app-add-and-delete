/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos } from './api/todos';
import type { Todo } from './types/Todo';
import * as postService from './api/todos';
import classNames from 'classnames';

export const App: React.FC = () => {
  const [todosList, setTodosList] = useState<Todo[]>([]);
  const [value, setValue] = useState<string>('');
  const [filter, setFilter] = useState<string>('all');
  const inputRefMain = useRef<HTMLInputElement>(null);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    getTodos()
      .then(setTodosList)
      .catch(() => {
        setLoadingError('Unable to load todos');
      });
  }, []);

  useEffect(() => {
    inputRefMain.current?.focus();
  }, []);

  useEffect(() => {
    if (!loading) {
      inputRefMain.current?.focus();
    }
  }, [loading]);

  useEffect(() => {
    if (loadingError === null) {
      return;
    }

    const timer = setTimeout(() => {
      setLoadingError(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [loadingError]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  function deleteTodo(todoId: number) {
    return postService
      .deleteTodo(todoId)
      .then(() => {
        setTodosList(currentTodo =>
          currentTodo.filter(todo => todo.id !== todoId),
        );
        inputRefMain.current?.focus();
      })
      .catch(() => setLoadingError('Unable to delete a todo'));
  }

  function addTodo({ completed, title, userId }: Omit<Todo, 'id'>) {
    setLoading(true);

    return postService
      .createTodo({ completed, title, userId })
      .then(newTodo => {
        setTodosList(currentTodos => [...currentTodos, newTodo]);
        setValue('');
        setLoading(false);
        setLoadingError(null);
      })
      .catch(() => {
        setLoadingError('Unable to add a todo');
        setTempTodo(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const displayedTodos =
    filter === 'active'
      ? todosList.filter(item => !item.completed)
      : filter === 'completed'
        ? todosList.filter(item => item.completed)
        : todosList;

  const allCompleted =
    todosList.length > 0 && todosList.every(item => item.completed);

  function deleteCompletedTodos(): void {
    displayedTodos
      .filter(item => item.completed)
      .forEach(item => deleteTodo(item.id));
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className={classNames('todoapp__toggle-all', {
              active: allCompleted,
            })}
            data-cy="ToggleAllButton"
            onClick={() => {
              const selected = !allCompleted;

              setTodosList(
                todosList.map(item => ({
                  ...item,
                  completed: selected,
                })),
              );
            }}
          />

          {/* Add a todo on form submit */}
          <form
            onSubmit={async e => {
              e.preventDefault();

              if (value.trim() === '') {
                setLoadingError('Title should not be empty');
              } else {
                const newTempTodo = {
                  id: 0,
                  title: value,
                  completed: false,
                  userId: USER_ID,
                };

                setTempTodo(newTempTodo);
                await addTodo({
                  completed: false,
                  title: value,
                  userId: USER_ID,
                });
                setTempTodo(null);
              }
            }}
          >
            <input
              data-cy="NewTodoField"
              type="text"
              ref={inputRefMain}
              className="todoapp__new-todo"
              disabled={loading}
              placeholder="What needs to be done?"
              value={value}
              onChange={e => {
                setValue(e.target.value);
              }}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {/* This todo is an active todo */}
          {displayedTodos.map(item => (
            <div
              data-cy="Todo"
              className={classNames('todo', {
                completed: item.completed,
                active: !item.completed,
              })}
              key={item.id}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">
                {item.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={async () => {
                  setLoadingId(item.id);
                  try {
                    await deleteTodo(item.id);
                  } catch {
                    // eslint-disable-next-line no-console
                    console.error('Error delete');
                  } finally {
                    setLoadingId(null);
                  }
                }}
              >
                ×
              </button>
              <div
                data-cy="TodoLoader"
                className={classNames('modal overlay', {
                  'is-active': loadingId === item.id,
                })}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          ))}
          {tempTodo && (
            <div className="todo">
              <label className="todo__status-label ">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status "
                />
              </label>

              <span className="todo__title">{tempTodo.title}</span>

              <div data-cy="TodoLoader" className="modal overlay is-active">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          )}

          {/* {loading && <div className="loader" />} */}
        </section>

        {/* Hide the footer if there are no todos */}
        {todosList.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {todosList.length} items left
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={classNames('filter__link', {
                  selected: filter === 'all',
                })}
                data-cy="FilterLinkAll"
                onClick={() => setFilter('all')}
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames('filter__link', {
                  selected: filter === 'active',
                })}
                data-cy="FilterLinkActive"
                onClick={() => {
                  setFilter('active');
                }}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={classNames('filter__link', {
                  selected: filter === 'completed',
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => {
                  setFilter('completed');
                }}
              >
                Completed
              </a>
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={todosList.filter(item => item.completed).length === 0}
              onClick={() => {
                deleteCompletedTodos();
              }}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: loadingError === null,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setLoadingError(null)}
        />
        {/* show only one message at a time */}
        {loadingError}
      </div>
    </div>
  );
};
