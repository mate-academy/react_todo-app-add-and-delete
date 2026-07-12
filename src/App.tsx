/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos, addTodo, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';
import { ErrorMessage } from './types/ErrorMessage';

type FilterStatus = 'all' | 'active' | 'completed';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMsg, setErrorMsg] = useState<ErrorMessage>(ErrorMessage.NoError);
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showError = (message: ErrorMessage) => {
    setErrorMsg(message);
    if (errorTimerRef.current) {
      clearTimeout(errorTimerRef.current);
    }

    errorTimerRef.current = setTimeout(() => {
      setErrorMsg(ErrorMessage.NoError);
    }, 3000);
  };

  useEffect(() => {
    setErrorMsg(ErrorMessage.NoError);
    getTodos()
      .then(setTodos)
      .catch(() => showError(ErrorMessage.UnableToLoad));
  }, []);

  useEffect(() => {
    if (!isSubmitting) {
      inputRef.current?.focus();
    }
  }, [isSubmitting, todos]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();

    if (!trimmed) {
      showError(ErrorMessage.EmptyTitle);

      return;
    }

    setIsSubmitting(true);
    setErrorMsg(ErrorMessage.NoError);

    const temp: Todo = {
      id: 0,
      userId: USER_ID,
      title: trimmed,
      completed: false,
    };

    setTempTodo(temp);

    addTodo(trimmed)
      .then(newTodo => {
        setTodos(prev => [...prev, newTodo]);
        setTitle('');
      })
      .catch(() => showError(ErrorMessage.UnableToAdd))
      .finally(() => {
        setTempTodo(null);
        setIsSubmitting(false);
      });
  };

  const handleDelete = (id: number) => {
    setLoadingIds(prev => [...prev, id]);

    deleteTodo(id)
      .then(() => {
        setTodos(prev => prev.filter(t => t.id !== id));
        inputRef.current?.focus();
      })
      .catch(() => showError(ErrorMessage.UnableToDelete))
      .finally(() => {
        setLoadingIds(prev => prev.filter(i => i !== id));
      });
  };

  const handleClearCompleted = () => {
    const completed = todos.filter(t => t.completed);

    completed.forEach(todo => handleDelete(todo.id));
  };

  const handleFilterAll = () => setFilter('all');
  const handleFilterActive = () => setFilter('active');
  const handleFilterCompleted = () => setFilter('completed');
  const handleHideError = () => setErrorMsg(ErrorMessage.NoError);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  const activeTodosCount = todos.filter(t => !t.completed).length;
  const hasCompleted = todos.some(t => t.completed);

  const allLinkClass =
    filter === 'all' ? 'filter__link selected' : 'filter__link';
  const activeLinkClass =
    filter === 'active' ? 'filter__link selected' : 'filter__link';
  const completedLinkClass =
    filter === 'completed' ? 'filter__link selected' : 'filter__link';
  const notificationClass = errorMsg
    ? 'notification is-danger is-light has-text-weight-normal'
    : 'notification is-danger is-light has-text-weight-normal hidden';
  const modalBgClass = 'modal-background has-background-white-ter';

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className="todoapp__toggle-all active"
              data-cy="ToggleAllButton"
            />
          )}

          <form onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={e => setTitle(e.target.value)}
              disabled={isSubmitting}
            />
          </form>
        </header>

        {(todos.length > 0 || tempTodo) && (
          <>
            <section className="todoapp__main" data-cy="TodoList">
              {filteredTodos.map(todo => {
                const todoClass = todo.completed ? 'todo completed' : 'todo';
                const isLoading = loadingIds.includes(todo.id);
                const loaderClass = isLoading
                  ? 'modal overlay is-active'
                  : 'modal overlay';

                return (
                  <div key={todo.id} data-cy="Todo" className={todoClass}>
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
                    >
                      ×
                    </button>

                    <div data-cy="TodoLoader" className={loaderClass}>
                      <div className={modalBgClass} />
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
                    <div className={modalBgClass} />
                    <div className="loader" />
                  </div>
                </div>
              )}
            </section>

            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="TodosCounter">
                {activeTodosCount} items left
              </span>

              <nav className="filter" data-cy="Filter">
                <a
                  href="#/"
                  className={allLinkClass}
                  data-cy="FilterLinkAll"
                  onClick={handleFilterAll}
                >
                  All
                </a>

                <a
                  href="#/active"
                  className={activeLinkClass}
                  data-cy="FilterLinkActive"
                  onClick={handleFilterActive}
                >
                  Active
                </a>

                <a
                  href="#/completed"
                  className={completedLinkClass}
                  data-cy="FilterLinkCompleted"
                  onClick={handleFilterCompleted}
                >
                  Completed
                </a>
              </nav>

              <button
                type="button"
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
                disabled={!hasCompleted}
                onClick={handleClearCompleted}
              >
                Clear completed
              </button>
            </footer>
          </>
        )}
      </div>

      <div data-cy="ErrorNotification" className={notificationClass}>
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={handleHideError}
        />
        {errorMsg}
      </div>
    </div>
  );
};
