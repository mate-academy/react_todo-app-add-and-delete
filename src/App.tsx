/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import cn from 'classnames';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [posts, setPosts] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const filteredPosts = posts.filter(post => {
    if (filter === 'active') {
      return !post.completed;
    }

    if (filter === 'completed') {
      return post.completed;
    }

    return true;
  });

  function addErrorMessage(message: string) {
    setErrorMessages([message]);
  }

  function removeErrorMessage(message: string) {
    setErrorMessages(prev => prev.filter(error => error !== message));
  }

  function handleDeleteTodo(todoId: number) {
    setErrorMessages([]);
    setLoading(true);

    todoService
      .deleteTodo({ todoId })
      .then(() => {
        setPosts(prevPosts => prevPosts.filter(post => post.id !== todoId));
      })
      .catch(() => {
        const errorMessage = 'Unable to delete todo';

        addErrorMessage(errorMessage);
        setTimeout(() => removeErrorMessage(errorMessage), 5000);
      })
      .finally(() => setLoading(false));
  }

  function handleLoadPosts() {
    setErrorMessages([]);
    setLoading(true);

    todoService
      .getTodos()
      .then(setPosts)
      .catch(() => {
        const errorMessage = 'Unable to load todos';

        addErrorMessage(errorMessage);
        setTimeout(() => removeErrorMessage(errorMessage), 5000);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }

    handleLoadPosts();
  }, []);

  function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  function handleQueryChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          {posts.length !== 0 && (
            <button
              type="button"
              className={cn('todoapp__toggle-all', {
                active: posts.every(post => post.completed),
              })}
              data-cy="ToggleAllButton"
            />
          )}

          {/* Add a todo on form submit */}
          <form onSubmit={handleFormSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              ref={inputRef}
              value={query}
              onChange={handleQueryChange}
            />
          </form>
        </header>

        {!loading &&
          filteredPosts.map(post => (
            <section className="todoapp__main" data-cy="TodoList" key={post.id}>
              {/* This is a completed todo */}
              {post.completed && (
                <div data-cy="Todo" className="todo completed" key={post.id}>
                  <label className="todo__status-label">
                    <input
                      data-cy="TodoStatus"
                      type="checkbox"
                      className="todo__status"
                      checked
                    />
                  </label>

                  <span data-cy="TodoTitle" className="todo__title">
                    {post.title}
                  </span>

                  {/* Remove button appears only on hover */}
                  <button
                    type="button"
                    className="todo__remove"
                    data-cy="TodoDelete"
                    onClick={() => handleDeleteTodo(post.id)}
                  >
                    ×
                  </button>

                  {/* overlay will cover the todo while it is being deleted or updated */}
                  <div data-cy="TodoLoader" className="modal overlay">
                    <div className="modal-background has-background-white-ter" />
                    <div className="loader" />
                  </div>
                </div>
              )}

              {/* This todo is an active todo */}
              {!post.completed && (
                <div data-cy="Todo" className="todo" key={post.id}>
                  <label className="todo__status-label">
                    <input
                      data-cy="TodoStatus"
                      type="checkbox"
                      className="todo__status"
                    />
                  </label>

                  <span data-cy="TodoTitle" className="todo__title">
                    {post.title}
                  </span>
                  <button
                    type="button"
                    className="todo__remove"
                    data-cy="TodoDelete"
                    onClick={() => handleDeleteTodo(post.id)}
                  >
                    ×
                  </button>

                  <div data-cy="TodoLoader" className="modal overlay">
                    <div className="modal-background has-background-white-ter" />
                    <div className="loader" />
                  </div>
                </div>
              )}

              {/* This todo is being edited */}
              <div data-cy="Todo" className="todo">
                <label className="todo__status-label">
                  <input
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                  />
                </label>

                {/* This form is shown instead of the title and remove button */}
                <form>
                  <input
                    data-cy="TodoTitleField"
                    type="text"
                    className="todo__title-field"
                    placeholder="Empty todo will be deleted"
                    value="Todo is being edited now"
                  />
                </form>

                <div data-cy="TodoLoader" className="modal overlay">
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>

              {/* This todo is in loadind state */}
              <div data-cy="Todo" className="todo">
                <label className="todo__status-label">
                  <input
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                  />
                </label>

                <span data-cy="TodoTitle" className="todo__title">
                  Todo is being saved now
                </span>

                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  onClick={() => handleDeleteTodo(post.id)}
                >
                  ×
                </button>

                {/* 'is-active' class puts this modal on top of the todo */}
                <div data-cy="TodoLoader" className="modal overlay is-active">
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            </section>
          ))}

        {/* Hide the footer if there are no todos */}
        {posts.length !== 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {posts.filter(post => !post.completed).length} items left
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={cn('filter__link', { selected: filter === 'all' })}
                onClick={() => setFilter('all')}
                data-cy="FilterLinkAll"
              >
                All
              </a>
              <a
                href="#/active"
                className={cn('filter__link', {
                  selected: filter === 'active',
                })}
                onClick={() => setFilter('active')}
                data-cy="FilterLinkActive"
              >
                Active
              </a>
              <a
                href="#/completed"
                className={cn('filter__link', {
                  selected: filter === 'completed',
                })}
                onClick={() => setFilter('completed')}
                data-cy="FilterLinkCompleted"
              >
                Completed
              </a>
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={posts.filter(post => post.completed).length === 0}
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
        className={`notification is-danger is-light has-text-weight-normal ${
          errorMessages.length ? '' : 'hidden'
        }`}
      >
        {errorMessages.length > 0 && (
          <>
            <button
              data-cy="HideErrorButton"
              type="button"
              className="delete"
              onClick={() => setErrorMessages([])}
            />
            {errorMessages[0]}
          </>
        )}
      </div>
    </div>
  );
};
