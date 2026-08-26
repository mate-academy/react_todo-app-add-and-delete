/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { getTodos } from './api/todos';
import { postTodos } from './api/todos';
import { deleteTodo } from './api/todos';
import { Todo } from './types/Todo';
import './styles/filter.scss';
import './styles/index.scss';
import './styles/todo.scss';
import './styles/todoapp.scss';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [newTodoField, setNewTodoField] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null);

  useEffect(() => {
    setErrorMessage('');
    getTodos()
      .then(result => {
        setTodos(result);
        setLoading(false);
      })
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setLoading(false);
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      });
  }, []);

  useEffect(() => {
    // Таймер создается всегда
    const timer = setTimeout(() => {
      if (!isCreating && !loading) {
        inputRef.current?.focus();
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [isCreating, loading, todos.length]);

  let filteredTodos = todos;

  if (filter === 'active') {
    filteredTodos = todos.filter(todo => todo.completed === false);
  }

  if (filter === 'completed') {
    filteredTodos = todos.filter(todo => todo.completed === true);
  }

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      {loading ? (
        <div className="loader" />
      ) : (
        <div className="todoapp__content">
          <header className="todoapp__header">
            {todos.length > 0 && (
              <button
                type="button"
                className={
                  todos.every(todo => todo.completed === true)
                    ? 'todoapp__toggle-all active'
                    : 'todoapp__toggle-all'
                }
                data-cy="ToggleAllButton"
              />
            )}

            {/* Add a todo on form submit */}
            <form
              onSubmit={event => {
                event.preventDefault();

                if (isCreating) {
                  return;
                }

                const trimNewTodoField = newTodoField.trim();

                if (trimNewTodoField === '') {
                  setErrorMessage('Title should not be empty');
                  setTimeout(() => {
                    setErrorMessage('');
                  }, 3000);

                  inputRef.current?.focus();

                  return;
                }

                const newTodo = {
                  userId: USER_ID,
                  title: trimNewTodoField,
                  completed: false,
                };

                setTempTodo({
                  id: 0,
                  userId: USER_ID,
                  title: trimNewTodoField,
                  completed: false,
                });

                setIsCreating(true);

                postTodos(newTodo)
                  .then(todo => {
                    setTodos([...todos, todo]);
                    setTempTodo(null);
                    setNewTodoField('');
                    inputRef.current?.focus();
                  })

                  .catch(() => {
                    setErrorMessage('Unable to add a todo');

                    setTimeout(() => {
                      setErrorMessage('');
                    }, 3000);

                    setTempTodo(null);
                    setNewTodoField(trimNewTodoField);
                    inputRef.current?.focus();
                  })

                  .finally(() => {
                    setTempTodo(null);
                    setIsCreating(false);
                  });
              }}
            >
              <input
                ref={inputRef}
                autoFocus
                disabled={isCreating}
                onChange={event => {
                  setNewTodoField(event.target.value);
                }}
                value={newTodoField}
                data-cy="NewTodoField"
                type="text"
                className="todoapp__new-todo"
                placeholder="What needs to be done?"
              />
            </form>
          </header>

          {todos.length > 0 && (
            <>
              <section className="todoapp__main" data-cy="TodoList">
                {filteredTodos.map(todo => (
                  <div
                    key={todo.id}
                    data-cy="Todo"
                    className={todo.completed ? 'todo completed' : 'todo'}
                  >
                    <label className="todo__status-label">
                      <input
                        data-cy="TodoStatus"
                        type="checkbox"
                        className="todo__status"
                        checked={todo.completed}
                      />
                    </label>

                    <span data-cy="TodoTitle" className="todo__title">
                      {todo.title}
                    </span>

                    <button
                      type="button"
                      className="todo__remove"
                      data-cy="TodoDelete"
                      onClick={() => {
                        setDeletingTodoId(todo.id);

                        deleteTodo(todo.id)
                          .then(() => {
                            setTodos(
                              todos.filter(todoItem => todoItem.id !== todo.id),
                            );
                          })
                          .catch(() => {
                            setErrorMessage('Unable to delete a todo');
                            setTimeout(() => {
                              setErrorMessage('');
                            }, 3000);
                          })
                          .finally(() => {
                            setDeletingTodoId(null);
                            inputRef.current?.focus();
                          });
                      }}
                    >
                      ×
                    </button>

                    {/* overlay will cover the todo while it is being deleted or updated */}
                    <div
                      data-cy="TodoLoader"
                      className={
                        deletingTodoId === todo.id
                          ? 'modal overlay is-active'
                          : 'modal overlay'
                      }
                    >
                      {/* eslint-disable-next-line max-len */}
                      <div className="modal-background has-background-white-ter" />
                      <div className="loader" />
                    </div>
                  </div>
                ))}
              </section>

              {tempTodo !== null && (
                <div data-cy="Todo" className="todo">
                  <span data-cy="TodoTitle" className="todo__title">
                    {tempTodo.title}
                  </span>
                  <div data-cy="TodoLoader" className="modal overlay is-active">
                    {/* eslint-disable-next-line max-len */}
                    <div className="modal-background has-background-white-ter" />
                    <div className="loader" />
                  </div>
                </div>
              )}

              <footer className="todoapp__footer" data-cy="Footer">
                <span className="todo-count" data-cy="TodosCounter">
                  {todos.filter(todo => todo.completed === false).length} items
                  left
                </span>

                <nav className="filter" data-cy="Filter">
                  <a
                    href="#/"
                    onClick={() => setFilter('all')}
                    className={
                      filter === 'all'
                        ? 'filter__link selected'
                        : 'filter__link'
                    }
                    data-cy="FilterLinkAll"
                  >
                    All
                  </a>

                  <a
                    href="#/active"
                    onClick={() => setFilter('active')}
                    className={
                      filter === 'active'
                        ? 'filter__link selected'
                        : 'filter__link'
                    }
                    data-cy="FilterLinkActive"
                  >
                    Active
                  </a>

                  <a
                    href="#/completed"
                    onClick={() => setFilter('completed')}
                    className={
                      filter === 'completed'
                        ? 'filter__link selected'
                        : 'filter__link'
                    }
                    data-cy="FilterLinkCompleted"
                  >
                    Completed
                  </a>
                </nav>

                <button
                  type="button"
                  disabled={!todos.some(todo => todo.completed === true)}
                  className="todoapp__clear-completed"
                  data-cy="ClearCompletedButton"
                  onClick={() => {
                    const completedTodos = todos.filter(
                      todo => todo.completed === true,
                    );

                    Promise.allSettled(
                      completedTodos.map(todo => deleteTodo(todo.id)),
                    ).then(results => {
                      const successfulTodoIds = results
                        .map((result, index) => {
                          if (result.status === 'fulfilled') {
                            return completedTodos[index].id;
                          }

                          return null;
                        })
                        .filter(id => id !== null);

                      setTodos(
                        todos.filter(
                          todo => !successfulTodoIds.includes(todo.id),
                        ),
                      );

                      const hasError = results.some(
                        result => result.status === 'rejected',
                      );

                      if (hasError) {
                        setErrorMessage('Unable to delete a todo');
                        setTimeout(() => {
                          setErrorMessage('');
                        }, 3000);
                      }
                    });
                  }}
                >
                  Clear completed
                </button>
              </footer>
            </>
          )}
        </div>
      )}

      <div
        data-cy="ErrorNotification"
        className={
          errorMessage
            ? 'notification is-danger is-light has-text-weight-normal'
            : 'notification is-danger is-light has-text-weight-normal hidden' // eslint-disable-line max-len
        }
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />

        {errorMessage}
      </div>
    </div>
  );
};
