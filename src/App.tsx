/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { UserWarning } from './UserWarning';
import { client } from './utils/fetchClient';
import { Todo } from './types/Todo';

enum Error {
  NONE = '',
  LOAD_TODOS = 'Unable to load todos',
  EMPTY_TITLE = 'Title should not be empty',
  ADD_TODO = 'Unable to add a todo',
  DELETE_TODO = 'Unable to delete a todo',
  UPDATE_TODO = 'Unable to update a todo',
}

const USER_ID = 2495;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [loadingTodoId, setLoadingTodoId] = useState<number | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [title, setTitle] = useState<string>('');
  const [titleError, setTitleError] = useState<boolean>(false);
  const [errorType, setErrorType] = useState<Error>(Error.NONE);

  useEffect(() => {
    if (errorType !== Error.NONE) {
      const timer = setTimeout(() => {
        setErrorType(Error.NONE);
      }, 3000);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [errorType]);

  const fetchTodos = () => {
    setLoading(true);

    client
      .get<Todo[]>(`/todos?userId=${USER_ID}`)
      .then(data => {
        setTodos(data);
        setLoading(false);
      })
      .catch(() => {
        setErrorType(Error.LOAD_TODOS);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  const visibleCount = filteredTodos.length;

  const updateTodo = (id: number, data: Partial<Todo>): Promise<Todo> => {
    return client.patch<Todo>(`/todos/${id}`, data);
  };

  const handleToggle = async (todo: Todo) => {
    setLoadingTodoId(todo.id);

    try {
      const updatedTodo = await updateTodo(todo.id, {
        completed: !todo.completed,
      });

      setTodos(prev => prev.map(t => (t.id === todo.id ? updatedTodo : t)));
      setErrorType(Error.NONE);
    } catch {
      setErrorType(Error.UPDATE_TODO);
    } finally {
      setLoadingTodoId(null);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleDelete = (id: number) => {
    client
      .delete(`/todos/${id}`)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
        setErrorType(Error.NONE);
      })
      .catch(() => {
        setErrorType(Error.DELETE_TODO);
      });
  };

  const handleClearAll = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    Promise.allSettled(
      completedTodos.map(todo => client.delete(`/todos/${todo.id}`)),
    )
      .then(() => {
        setTodos(prev => prev.filter(todo => !todo.completed));
        setErrorType(Error.NONE);
      })
      .catch(() => {
        setErrorType(Error.DELETE_TODO);
      });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim()) {
      setTitleError(true);
      setErrorType(Error.EMPTY_TITLE);

      return;
    }

    setTitleError(false);
    setErrorType(Error.NONE);

    const newTodo = {
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    client
      .post<Todo>('/todos', newTodo)
      .then(() => {
        fetchTodos();
        setTitle('');
      })
      .catch(() => {
        setErrorType(Error.ADD_TODO);
      });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  if (isLoading) {
    return <div>Loading todos...</div>;
  }

  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);
  const hasCompleted = todos.some(todo => todo.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={`todoapp__toggle-all ${allCompleted ? 'active' : ''}`}
            data-cy="ToggleAllButton"
            aria-label={
              allCompleted ? 'Unmark all todos' : 'Mark all todos as completed'
            }
            onClick={() => {
              const newCompleted = !allCompleted;

              Promise.all(
                todos.map(todo =>
                  updateTodo(todo.id, { completed: newCompleted }),
                ),
              )
                .then(updatedTodos => {
                  setTodos(updatedTodos);
                  setErrorType(Error.NONE);
                })
                .catch(() => {
                  setErrorType(Error.UPDATE_TODO);
                });
            }}
          />

          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              value={title}
              placeholder="What needs to be done?"
              className={`todoapp__new-todo ${titleError ? 'error' : ''}`}
              onChange={e => {
                handleChange(e);
                if (titleError && e.target.value.trim()) {
                  setTitleError(false);
                  setErrorType(Error.NONE);
                }
              }}
              aria-invalid={titleError}
              aria-describedby={titleError ? 'title-error' : undefined}
            />
          </form>
        </header>
        {todos.length > 0 && (
          <section className="todoapp__main" data-cy="TodoList">
            {filteredTodos.map(todo => (
              <div
                key={todo.id}
                className={`todo ${todo.completed ? 'completed' : ''}`}
                data-cy="Todo"
              >
                <label
                  className="todo__status-label"
                  htmlFor={`todo-checkbox-${todo.id}`}
                >
                  <input
                    id={`todo-checkbox-${todo.id}`}
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status active"
                    checked={todo.completed}
                    disabled={loadingTodoId === todo.id}
                    onChange={() => handleToggle(todo)}
                    aria-label={`Mark todo "${todo.title}" as completed`}
                  />
                </label>

                <span data-cy="TodoTitle" className="todo__title">
                  {todo.title}
                </span>

                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  aria-label={`Delete todo: ${todo.title}`}
                  onClick={() => handleDelete(todo.id)}
                >
                  ×
                </button>
              </div>
            ))}
          </section>
        )}

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {visibleCount} items left
            </span>

            <nav className="filter" data-cy="Filter" aria-label="Filter todos">
              <a
                href="#/"
                className={`filter__link ${filter === 'all' ? 'selected' : ''}`}
                data-cy="FilterLinkAll"
                onClick={e => {
                  e.preventDefault();
                  setFilter('all');
                }}
              >
                All
              </a>

              <a
                href="#/active"
                className={`filter__link ${filter === 'active' ? 'selected' : ''}`}
                data-cy="FilterLinkActive"
                onClick={e => {
                  e.preventDefault();
                  setFilter('active');
                }}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={`filter__link ${filter === 'completed' ? 'selected' : ''}`}
                data-cy="FilterLinkCompleted"
                onClick={e => {
                  e.preventDefault();
                  setFilter('completed');
                }}
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={handleClearAll}
              disabled={!hasCompleted}
              aria-disabled={!hasCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${
          errorType !== Error.NONE ? '' : 'hidden'
        }`}
        role="alert"
        aria-live="assertive"
      >
        {errorType !== Error.NONE && (
          <>
            <button
              data-cy="HideErrorButton"
              type="button"
              className="delete"
              aria-label="Close error notification"
              onClick={() => setErrorType(Error.NONE)}
            />
            {errorType}
          </>
        )}
      </div>
    </div>
  );
};
