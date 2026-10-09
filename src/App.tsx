/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, createTodo, deleteTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState('all');
  const [errorMessage, setErrorMessage] = useState('');
  const [title, setTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null);

  const newTodoFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timer = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  useEffect(() => {
    newTodoFieldRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!isAdding) {
      newTodoFieldRef.current?.focus();
    }
  }, [isAdding]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = todos.filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.completed;

      case 'completed':
        return todo.completed;

      default:
        return true;
    }
  });

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodosCount = todos.filter(todo => todo.completed).length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className="todoapp__toggle-all"
            data-cy="ToggleAllButton"
          />

          <form
            onSubmit={event => {
              event.preventDefault();

              const trimmedTitle = title.trim();

              if (!trimmedTitle) {
                setErrorMessage('Title should not be empty');

                return;
              }

              const temporaryTodo: Todo = {
                id: 0,
                userId: USER_ID,
                title: trimmedTitle,
                completed: false,
              };

              setTempTodo(temporaryTodo);

              setIsAdding(true);

              createTodo(trimmedTitle)
                .then(todo => {
                  setTodos(currentTodos => [...currentTodos, todo]);
                  setTempTodo(null);
                  setTitle('');
                })
                .catch(() => {
                  setErrorMessage('Unable to add a todo');
                  setTempTodo(null);
                })
                .finally(() => {
                  setIsAdding(false);
                });
            }}
          >
            <input
              ref={newTodoFieldRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={event => setTitle(event.target.value)}
              disabled={isAdding}
            />
          </form>
        </header>

        {(todos.length > 0 || tempTodo) && (
          <section className="todoapp__main" data-cy="TodoList">
            {visibleTodos.map(todo => (
              <div
                key={todo.id}
                data-cy="Todo"
                className={`todo ${todo.completed ? 'completed' : ''}`}
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
                  onClick={() => {
                    setDeletingTodoId(todo.id);

                    deleteTodo(todo.id)
                      .then(() => {
                        setTodos(currentTodos =>
                          currentTodos.filter(
                            currentTodo => currentTodo.id !== todo.id,
                          ),
                        );
                      })
                      .catch(() => {
                        setErrorMessage('Unable to delete a todo');
                      })
                      .finally(() => {
                        setDeletingTodoId(null);
                        newTodoFieldRef.current?.focus();
                      });
                  }}
                >
                  ×
                </button>

                <div
                  data-cy="TodoLoader"
                  className={`modal overlay ${
                    deletingTodoId === todo.id ? 'is-active' : ''
                  }`}
                >
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            ))}

            {tempTodo && (
              <div data-cy="Todo" className="todo">
                <label className="todo__status-label">
                  <input
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                    checked={false}
                    readOnly
                  />
                </label>

                <span data-cy="TodoTitle" className="todo__title">
                  {tempTodo.title}
                </span>

                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
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
              {activeTodosCount} items left
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={`filter__link ${filter === 'all' ? 'selected' : ''}`}
                data-cy="FilterLinkAll"
                onClick={() => setFilter('all')}
              >
                All
              </a>

              <a
                href="#/active"
                className={`filter__link ${
                  filter === 'active' ? 'selected' : ''
                }`}
                data-cy="FilterLinkActive"
                onClick={() => setFilter('active')}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={`filter__link ${
                  filter === 'completed' ? 'selected' : ''
                }`}
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
              disabled={completedTodosCount === 0}
              onClick={() => {
                const completedTodos = todos.filter(todo => todo.completed);

                Promise.allSettled(
                  completedTodos.map(todo => deleteTodo(todo.id)),
                ).then(results => {
                  const successfullyDeletedIds = completedTodos
                    .filter((_, index) => results[index].status === 'fulfilled')
                    .map(todo => todo.id);

                  setTodos(currentTodos =>
                    currentTodos.filter(
                      todo => !successfullyDeletedIds.includes(todo.id),
                    ),
                  );

                  const hasErrors = results.some(
                    result => result.status === 'rejected',
                  );

                  if (hasErrors) {
                    setErrorMessage('Unable to delete a todo');
                  }

                  newTodoFieldRef.current?.focus();
                });
              }}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${
          errorMessage ? '' : 'hidden'
        }`}
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
