/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useRef } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { getTodos, addTodo, deleteTodo } from './api/todos';
import { useEffect } from 'react';
import { useState } from 'react';
import cn from 'classnames';

export const App: React.FC = () => {
  const [todo, setTodo] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState('all');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  const LOAD_ERROR = {
    LOAD_TODOS: 'Unable to load todos',
  };

  const autoFocus = useRef<HTMLInputElement>(null);

  const handleDelete = (id: number) => {
    setLoadingIds(prev => [...prev, id]);
    deleteTodo(id)
      .then(() => setTodo(prev => prev.filter(t => t.id !== id)))
      .catch(() => setError('Unable to delete a todo'))
      .finally(() => {
        setLoadingIds(prev => prev.filter(Ids => Ids !== id));
        autoFocus.current?.focus();
      });
  };

  const clearCompleted = () => {
    todo.filter(t => t.completed).forEach(t => handleDelete(t.id));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) {
      setError('Title should not be empty');

      return;
    }

    setLoading(true);
    setTempTodo({
      id: 0,
      userId: USER_ID,
      completed: false,
      title: title.trim(),
    });

    addTodo({
      userId: USER_ID,
      completed: false,
      title: title.trim(),
    })
      .then(newTodo => {
        setTodo(prev => [...prev, newTodo]);
        setTitle('');
      })

      .catch(() => setError('Unable to add a todo'))
      .finally(() => {
        setLoading(false);
        setTempTodo(null);
        setTimeout(() => {
          autoFocus.current?.focus();
        }, 0);
      });
  };

  useEffect(() => {
    autoFocus.current?.focus();
  }, []);

  enum FILTERS {
    all = 'all',
    completed = 'completed',
    active = 'active',
  }

  useEffect(() => {
    getTodos()
      .then(data => setTodo(data))
      .catch(() => setError(LOAD_ERROR.LOAD_TODOS));
  }, []);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  }, [error]);

  const filterTodo = todo.filter(todos => {
    if (selected === 'active') {
      return !todos.completed;
    }

    if (selected === FILTERS.completed) {
      return todos.completed;
    }

    return true;
  });

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <form onSubmit={handleSubmit}>
            <input
              disabled={loading}
              value={title}
              onChange={event => setTitle(event.target.value)}
              ref={autoFocus}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form>
        </header>
        {todo.length > 0 && (
          <section className={cn('todoapp__main')} data-cy="TodoList">
            {filterTodo.map(t => (
              <div
                data-cy="Todo"
                className={`todo ${t.completed ? 'completed' : ''}`}
                key={t.id}
              >
                <label className="todo__status-label">
                  <input
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                    checked={t.completed}
                    readOnly
                  />
                </label>

                <span data-cy="TodoTitle" className="todo__title">
                  {t.title}
                </span>

                {/* Remove button appears only on hover */}
                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  onClick={() => handleDelete(t.id)}
                >
                  ×
                </button>

                {/* overlay will cover the todo while it is being deleted or updated */}
                <div
                  data-cy="TodoLoader"
                  className={`modal overlay ${loadingIds.includes(t.id) ? 'is-active' : ''}`}
                >
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            ))}
          </section>
        )}

        {tempTodo && (
          <div data-cy="Todo" className="todo">
            <label className="todo__status-label">
              <input type="checkbox" className="todo__status" readOnly />
            </label>
            <span data-cy="TodoTitle" className="todo__title">
              {tempTodo.title}
            </span>
            <div data-cy="TodoLoader" className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        )}

        {todo.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {todo.filter(t => !t.completed).length} items left
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={cn('filter__link', {
                  selected: selected === 'all',
                })}
                data-cy="FilterLinkAll"
                onClick={() => setSelected(FILTERS.all)}
              >
                All
              </a>

              <a
                href="#/active"
                className={cn('filter__link', {
                  selected: selected === 'active',
                })}
                data-cy="FilterLinkActive"
                onClick={() => setSelected(FILTERS.active)}
              >
                Active
              </a>
              <a
                href="#/completed"
                className={cn('filter__link', {
                  selected: selected === 'completed',
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => setSelected(FILTERS.completed)}
              >
                Completed
              </a>
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={clearCompleted}
              disabled={!todo.some(t => t.completed)}
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
        className={`notification is-danger is-light has-text-weight-normal ${error ? '' : 'hidden'}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError('')}
        />
        {error}
      </div>
    </div>
  );
};
