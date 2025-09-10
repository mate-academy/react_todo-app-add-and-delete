/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { addTodos, getTodos, deleteTodo, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { FilterType } from './types/FilterType';
import { ErrorType } from './types/ErrorType';
import classNames from 'classnames';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>('');
  const [filter, setFilter] = useState<FilterType>(FilterType.ALL);
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const delay = 3000;

  const showError = (message: string) => {
    setError(message);
    setTimeout(() => setError(null), delay);
  };

  const hideError = () => setError(null);

  const loadTodos = useCallback(() => {
    hideError();
    setIsLoading(true);

    getTodos()
      .then(setTodos)
      .catch(() => showError(ErrorType.LOAD_TODOS))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    loadTodos();
  }, [loadTodos]);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      showError(ErrorType.EMPTY_TITLE);

      return;
    }

    hideError();

    const newTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo(newTodo);

    if (inputRef.current) {
      inputRef.current.disabled = true;
    }

    addTodos(newTodo)
      .then(savedTodo => {
        setTodos(prev => [...prev, savedTodo]);
        setTitle('');
      })
      .catch(() => {
        showError(ErrorType.ADD_TODO);
        setTitle(trimmedTitle);
      })
      .finally(() => {
        setTempTodo(null);
        if (inputRef.current) {
          inputRef.current.disabled = false;
          inputRef.current.focus();
        }
      });
  };

  const handleDelete = (todoId: number) => {
    hideError();
    setDeletingTodoIds(prev => [...prev, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => showError(ErrorType.DELETE_TODO))
      .finally(() => {
        setDeletingTodoIds(prev => prev.filter(id => id !== todoId));
        if (inputRef.current) {
          inputRef.current.focus();
        }
      });
  };

  const handleClearCompleted = () => {
    hideError();

    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    let hasError = false;

    const deletionPromises = completedTodos.map(todo => {
      setDeletingTodoIds(prev => [...prev, todo.id]);

      return deleteTodo(todo.id)
        .then(() => {
          setTodos(currentTodos =>
            currentTodos.filter(item => item.id !== todo.id),
          );
        })
        .catch(() => {
          hasError = true;
        })
        .finally(() => {
          setDeletingTodoIds(prev => prev.filter(id => id !== todo.id));
        });
    });

    Promise.allSettled(deletionPromises).then(() => {
      if (hasError) {
        showError(ErrorType.DELETE_TODO);
      }

      inputRef.current?.focus();
    });
  };

  const visibleTodos = todos.filter(todo => {
    switch (filter) {
      case FilterType.ACTIVE:
        return !todo.completed;
      case FilterType.COMPLETED:
        return todo.completed;
      default:
        return true;
    }
  });

  const itemsLeft = todos.filter(todo => !todo.completed).length;
  const hasCompleted = todos.some(todo => todo.completed);
  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);

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
              className={classNames('todoapp__toggle-all', {
                active: allCompleted,
              })}
              data-cy="ToggleAllButton"
              disabled={todos.length === 0}
            />
          )}

          <form onSubmit={addTodo}>
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={e => setTitle(e.target.value)}
              autoFocus
            />
          </form>
        </header>

        {(todos.length > 0 || tempTodo) && (
          <section className="todoapp__main" data-cy="TodoList">
            {!isLoading &&
              visibleTodos.map(todo => (
                <div
                  key={todo.id}
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
                    disabled={deletingTodoIds.includes(todo.id)}
                  >
                    ×
                  </button>

                  {deletingTodoIds.includes(todo.id) && (
                    <div
                      data-cy="TodoLoader"
                      className="modal overlay is-active"
                    >
                      <div className="modal-background has-background-white-ter" />
                      <div className="loader" />
                    </div>
                  )}
                </div>
              ))}

            {tempTodo && (
              <div key="temp" data-cy="Todo" className="todo">
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

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {itemsLeft} items left
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={classNames('filter__link', {
                  selected: filter === FilterType.ALL,
                })}
                data-cy="FilterLinkAll"
                onClick={() => setFilter(FilterType.ALL)}
              >
                All
              </a>
              <a
                href="#/active"
                className={classNames('filter__link', {
                  selected: filter === FilterType.ACTIVE,
                })}
                data-cy="FilterLinkActive"
                onClick={() => setFilter(FilterType.ACTIVE)}
              >
                Active
              </a>
              <a
                href="#/completed"
                className={classNames('filter__link', {
                  selected: filter === FilterType.COMPLETED,
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => setFilter(FilterType.COMPLETED)}
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={handleClearCompleted}
              disabled={!hasCompleted}
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
            hidden: !error,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={hideError}
        />
        {error}
      </div>
    </div>
  );
};
