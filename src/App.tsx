/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { client } from './utils/fetchClient';
import { TodoItem } from './TodoItem';

export const App: React.FC = () => {
  //#region state
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState('all');
  const [errorMessage, setErrorMessage] = useState('');
  const [query, setQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null);
  const [updatingTodo, setUpdatingTodoId] = useState<number | null>(null);

  // #endregion

  const inputRef = useRef<HTMLInputElement>(null);

  // #region effect
  useEffect(() => {
    client
      .get<Todo[]>(`/todos?userId=${USER_ID}`)
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'));
  }, []);

  useEffect(() => {
    if (!isAdding) {
      inputRef.current?.focus();
    }
  }, [isAdding]);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    // #endregion
    const timer = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  const visibleTodos = todos.filter(todo => {
    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return true;
  });
  // #region handle
  const handleUpdate = (updatedTodo: Todo) => {
    setUpdatingTodoId(updatedTodo.id);
    {/* prettier-ignore */ }

    return client
      .patch<Todo>(`/todos/${updatedTodo.id}`, {
        title: updatedTodo.title,
        completed: updatedTodo.completed,
      })
      .then(serverTodo => {
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === serverTodo.id ? serverTodo : todo,
          ),
        );
      })
      .catch(err => {
        setErrorMessage('Unable to update a todo');
        throw err;
      })
      .finally(() => {
        setUpdatingTodoId(null);
      });
  };

  const activeCount = todos.filter(todo => !todo.completed).length;

  const handleDelete = (todoId: number) => {
    setDeletingTodoId(todoId);
    client
      .delete(`/todos/${todoId}`)
      .then(() => {
        setTodos(todos.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setDeletingTodoId(null);
        inputRef.current?.focus();
      });
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    Promise.allSettled(
      completedTodos.map(todo =>
        client.delete(`/todos/${todo.id}`).then(() => todo.id),
      ),
    )
      .then(results => {
        const successfullyDeletedIds = results
          .filter(
            (result): result is PromiseFulfilledResult<number> =>
              result.status === 'fulfilled',
          )
          .map(result => result.value);

        setTodos(prev =>
          prev.filter(todo => !successfullyDeletedIds.includes(todo.id)),
        );

        if (results.some(result => result.status === 'rejected')) {
          setErrorMessage('Unable to delete a todo');
        }
      })

      .finally(() => {
        inputRef.current?.focus();
      });
  };

  const handleToggleAll = () => {
    const areAllCompleted = todos.every(todo => todo.completed);
    const targetStatus = !areAllCompleted;

    const todosToUpdate = todos.filter(todo => todo.completed !== targetStatus);

    Promise.all(
      todosToUpdate.map(todo =>
        client.patch<Todo>(`/todos/${todo.id}`, { completed: targetStatus }),
      ),
    )

      .then(updatedTodo => {
        setTodos(prev =>
          prev.map(todo => {
            const updated = updatedTodo.find(item => item.id === todo.id);

            return updated || todo;
          }),
        );
      })

      .catch(() => {
        setErrorMessage('Unable to update a todo');
      });
  };

  // #endregion
  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={`todoapp__toggle-all ${todos.length > 0 && todos.every(todo => todo.completed) ? `active` : ''} `}
              data-cy="ToggleAllButton"
              onClick={handleToggleAll}
            />
          )}

          {/* Add a todo on form submit */}
          <form
            onSubmit={event => {
              event.preventDefault();
              if (!query.trim()) {
                setErrorMessage('Title should not be empty');

                return;
              }

              setIsAdding(true);
              setTempTodo({
                id: 0,
                title: query.trim(),
                completed: false,
                userId: USER_ID,
              });
              {/* prettier-ignore */ }

              client
                .post<Todo>(`/todos`, {
                  title: query.trim(),
                  completed: false,
                  userId: USER_ID,
                })
                .then(newTodo => {
                  setTodos(prevTodos => [...prevTodos, newTodo]);
                  setQuery('');
                  setTempTodo(null);
                  setIsAdding(false);

                  setTimeout(() => {
                    inputRef.current?.focus();
                  }, 0);
                })
                .catch(() => {
                  setErrorMessage('Unable to add a todo');
                  setTempTodo(null);
                  inputRef.current?.focus();
                  setIsAdding(false);
                });
            }}
          >
            <input
              value={query}
              disabled={isAdding}
              onChange={event => setQuery(event.target.value)}
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form>
        </header>
        {(todos.length > 0 || tempTodo) && (
          <section className="todoapp__main" data-cy="TodoList">
            {visibleTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
                isLoading={
                  deletingTodoId === todo.id || updatingTodo === todo.id
                }
              />
            ))}

            {tempTodo && (
              <TodoItem
                todo={tempTodo}
                isLoading={true}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            )}
          </section>
        )}

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeCount + ' items left'}
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={`filter__link ${filter === 'all' ? `selected` : ''}`}
                data-cy="FilterLinkAll"
                onClick={event => {
                  event.preventDefault();
                  setFilter('all');
                }}
              >
                All
              </a>

              <a
                href="#/active"
                className={`filter__link ${filter === 'active' ? `selected` : ''}`}
                data-cy="FilterLinkActive"
                onClick={event => {
                  event.preventDefault();
                  setFilter('active');
                }}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={`filter__link ${filter === 'completed' ? `selected` : ''}`}
                data-cy="FilterLinkCompleted"
                onClick={event => {
                  event.preventDefault();
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
              disabled={!todos.some(todo => todo.completed)}
              onClick={handleClearCompleted}
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
        className={`notification is-danger is-light has-text-weight-normal ${!errorMessage ? 'hidden' : ''}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={event => {
            event.preventDefault();
            setErrorMessage('');
          }}
        />
        {errorMessage}
      </div>
    </div>
  );
};
