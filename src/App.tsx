/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { UserWarning } from './UserWarning';
import { addTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';

type FilterType = 'all' | 'active' | 'completed';

export const App: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    });
    setIsSubmitting(true);

    addTodo(title.trim())
      .then(newTodo => {
        setTodos(prev => [...prev, newTodo]);
        setTitle('');
      })
      .catch(() => setErrorMessage('Unable to add a todo'))
      .finally(() => {
        setIsSubmitting(false);
        setTempTodo(null);
      });
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'))
      .finally(() => inputRef.current?.focus());
  }, []);

  useEffect(() => {
    if (!isSubmitting) {
      inputRef.current?.focus();
    }
  }, [isSubmitting]);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timer = setTimeout(() => setErrorMessage(''), 3000);

    return () => clearTimeout(timer); // cleanup
  }, [errorMessage]);

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  const activeCount = todos.filter(todo => !todo.completed).length;

  const handleDelete = (id: number) => {
    setDeletingIds(prev => [...prev, id]);

    deleteTodo(id)
      .then(() => setTodos(prev => prev.filter(todo => todo.id !== id)))
      .catch(() => setErrorMessage('Unable to delete a todo'))
      .finally(() => {
        setDeletingIds(prev => prev.filter(deletingId => deletingId !== id));
        inputRef.current?.focus();
      });
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    Promise.all(completedTodos.map(todo => handleDelete(todo.id)));
  };

  //Guard
  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          {todos.length > 0 && (
            <button
              type="button"
              className={cn('todoapp__toggle-all', {
                active: todos.every(todo => todo.completed),
              })}
              data-cy="ToggleAllButton"
            />
          )}
          {/* Add a todo on form submit */}
          <form onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={event => setTitle(event.target.value)}
              disabled={isSubmitting}
            />
          </form>
        </header>

        {todos.length > 0 && (
          <>
            <section className="todoapp__main" data-cy="TodoList">
              {/* This is a completed todo */}
              {filteredTodos.map(todo => (
                <div
                  key={todo.id}
                  data-cy="Todo"
                  className={cn('todo', { completed: todo.completed })}
                >
                  <label className="todo__status-label">
                    <input
                      data-cy="TodoStatus"
                      type="checkbox"
                      className="todo__status"
                      checked={todo.completed}
                      onChange={() => {}}
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
                    onClick={() => handleDelete(todo.id)}
                  >
                    ×
                  </button>

                  {/* overlay will cover the todo while it is being deleted or updated */}
                  <div
                    data-cy="TodoLoader"
                    className={cn('modal overlay', {
                      'is-active': deletingIds.includes(todo.id),
                    })}
                  >
                    {/* eslint-disable-next-line max-len */}
                    <div className="modal-background has-background-white-ter" />
                    <div className="loader" />
                  </div>
                </div>
              ))}
            </section>

            {/* Hide the footer if there are no todos */}
            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="TodosCounter">
                {activeCount} items left
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

              {/* this button should be disabled if there are no completed todos */}
              <button
                type="button"
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
                disabled={todos.every(todo => !todo.completed)}
                onClick={handleClearCompleted}
              >
                Clear completed
              </button>
            </footer>
          </>
        )}

        {tempTodo && (
          <div data-cy="Todo" className="todo">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              {tempTodo.title}
            </span>

            <button type="button" className="todo__remove" data-cy="TodoDelete">
              ×
            </button>

            <div data-cy="TodoLoader" className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={cn(
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
          onClick={() => setErrorMessage('')}
        />

        {/* show only one message at a time */}
        {errorMessage}
      </div>
    </div>
  );
};
