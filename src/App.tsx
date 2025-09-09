/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  deleteTodo,
  getTodos,
  patchTodo,
  postTodo,
  USER_ID,
} from './api/todos';
import cn from 'classnames';
import { Todo, TodoWithLoading } from './types/types';

function areAllTodosCompleted(todos: Todo[]) {
  return todos.every(todo => todo.completed);
}

function filterTodos(
  todos: TodoWithLoading[],
  filter: 'all' | 'active' | 'completed',
) {
  return todos.filter(todo => {
    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return true;
  });
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<TodoWithLoading[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [allCompleted, setAllCompleted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [hasLoading, setHasLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setHasLoading(true);
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      })
      .finally(() => setHasLoading(false));
  }, []);

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  }, [errorMessage]);

  useEffect(() => {
    if (!hasLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [hasLoading]);

  const filteredTodos = filterTodos(todos, filter);

  return !USER_ID ? (
    <UserWarning />
  ) : (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length !== 0 && (
            <button
              type="button"
              className={cn('todoapp__toggle-all', {
                active: areAllTodosCompleted(todos),
              })}
              data-cy="ToggleAllButton"
              onClick={() => {
                setTodos(prevTodos => {
                  return prevTodos.map(todo => ({
                    ...todo,
                    completed: !allCompleted,
                  }));
                });
                setAllCompleted(prevState => !prevState);
              }}
            />
          )}
          <form
            onSubmit={event => {
              event.preventDefault();

              const title = newTodoTitle.trim();

              if (!title) {
                setErrorMessage('Title should not be empty');
              } else {
                setHasLoading(true);

                const tempId = Date.now();
                const tempTodo: TodoWithLoading = {
                  id: tempId,
                  userId: USER_ID,
                  title,
                  completed: false,
                  loading: true,
                };

                setTodos(prevState => [...prevState, tempTodo]);

                postTodo(title)
                  .then(newTodo => {
                    setTodos(prevTodos =>
                      prevTodos
                        .filter(t => t.id !== tempTodo.id)
                        .concat({ ...newTodo, loading: false }),
                    );
                    setNewTodoTitle('');
                  })
                  .catch(() => {
                    setErrorMessage('Unable to add a todo');
                    setTodos(prev => prev.filter(t => t.id !== tempTodo.id));
                  })
                  .finally(() => setHasLoading(false));
              }
            }}
          >
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodoTitle}
              onChange={event => setNewTodoTitle(event.target.value)}
              autoFocus
              disabled={hasLoading}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => (
            <div
              data-cy="Todo"
              className={cn('todo', { completed: todo.completed })}
              key={todo.id}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={todo.completed}
                  onChange={() => {
                    const newCompleted = !todo.completed;

                    setHasLoading(true);

                    patchTodo(todo.id, { completed: newCompleted })
                      .then(() => {
                        setTodos(prevTodos =>
                          prevTodos.map(t => {
                            return t.id === todo.id
                              ? { ...t, completed: newCompleted }
                              : t;
                          }),
                        );
                      })
                      .catch(() => {
                        setErrorMessage('Unable to update a todo');
                      })
                      .finally(() => setHasLoading(false));
                  }}
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">
                {todo.title}
              </span>

              {/* Remove button appears only on hover */}
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={event => {
                  event.preventDefault();

                  setTodos(prevTodos =>
                    prevTodos.map(t =>
                      t.id === todo.id ? { ...t, loading: true } : t,
                    ),
                  );

                  deleteTodo(todo.id)
                    .then(deletedId => {
                      setTodos(prevTodos =>
                        prevTodos.filter(
                          currentTodo => currentTodo.id !== deletedId,
                        ),
                      );
                      inputRef.current?.focus();
                    })
                    .catch(() => {
                      setErrorMessage('Unable to delete a todo');
                      // Reset loading if error occurs
                      setTodos(prevTodos =>
                        prevTodos.map(t =>
                          t.id === todo.id ? { ...t, loading: false } : t,
                        ),
                      );
                    });
                }}
              >
                ×
              </button>

              {/* overlay will cover the todo while it is being deleted or updated */}
              <div
                data-cy="TodoLoader"
                className={cn('modal overlay', {
                  'is-active': todo.loading,
                })}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          ))}
        </section>

        {todos.length !== 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {todos
                .filter(todo => !todo.loading) // ignore temp todos
                .reduce(
                  (count, todo) => count + (!todo.completed ? 1 : 0),
                  0,
                )}{' '}
              items left
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={cn('filter__link', { selected: filter === 'all' })}
                data-cy="FilterLinkAll"
                onClick={() => setFilter('all')}
              >
                All
              </a>

              <a
                href="#/active"
                className={cn('filter__link', {
                  selected: filter === 'active',
                })}
                data-cy="FilterLinkActive"
                onClick={() => setFilter('active')}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={cn('filter__link', {
                  selected: filter === 'completed',
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => setFilter('completed')}
              >
                Completed
              </a>
            </nav>
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={!todos.some(t => t.completed)}
              onClick={event => {
                const completedTodos = todos.filter(t => t.completed);

                event.preventDefault();

                setHasLoading(true);

                Promise.allSettled(completedTodos.map(t => deleteTodo(t.id)))
                  .then(results => {
                    const successfulIds = results
                      .filter(
                        (res): res is PromiseFulfilledResult<number> =>
                          res.status === 'fulfilled',
                      )
                      .map(res => res.value);

                    if (results.some(res => res.status === 'rejected')) {
                      setErrorMessage('Unable to delete a todo');
                    }

                    setTodos(prevTodos =>
                      prevTodos.filter(t => !successfulIds.includes(t.id)),
                    );
                  })
                  .finally(() => setHasLoading(false));
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
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button data-cy="HideErrorButton" type="button" className="delete" />
        {errorMessage ? errorMessage : ''}
      </div>
    </div>
  );
};
