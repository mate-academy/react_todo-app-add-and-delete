/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { addTodos, deleteTodos, getTodos, USER_ID } from './api/todos';

import classNames from 'classnames';
import { Todo } from './types/todo';
import { TempTodo } from './TempTodo';

type Filter = 'all' | 'active' | 'completed';

export const App: React.FC = () => {
  const [title, setTitle] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const [errorMessage, setErrorMessage] = useState('');

  const titleField = useRef<HTMLInputElement>(null);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const newTitle = title.trim();

    if (!newTitle) {
      setErrorMessage('Title should not be empty');
      titleField.current?.focus();

      return;
    }

    setErrorMessage('');
    setIsDisabled(true);

    const cusTodo: Todo = {
      id: 0,
      completed: false,
      title: newTitle,
      userId: USER_ID,
    };

    setTempTodo(cusTodo);

    addTodos({ title: newTitle, userId: USER_ID, completed: false })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTempTodo(null);
        setTitle('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        setTempTodo(null);
      })
      .finally(() => {
        setIsDisabled(false);
        setTimeout(() => {
          titleField.current?.focus();
        }, 0);
      });
  }

  function handleDeleteTodo(todoId: number) {
    setErrorMessage('');
    setLoadingIds(currentLoadingIds => [...currentLoadingIds, todoId]);

    deleteTodos(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setLoadingIds(currentIds => currentIds.filter(id => id !== todoId));
        titleField.current?.focus();
      });
  }

  function loadingTodos() {
    setErrorMessage('');
    setLoading(true);

    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'))
      .finally(() => {
        setLoading(false);
        setTimeout(() => {
          titleField.current?.focus();
        }, 0);
      });
  }

  function handleClearCompleted() {
    todos.filter(t => t.completed).forEach(t => handleDeleteTodo(t.id));
  }

  useEffect(loadingTodos, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timer = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const todosFilters = () => {
    return todos.filter(todo => {
      switch (filter) {
        case 'active':
          return !todo.completed;
        case 'completed':
          return todo.completed;

        default:
          return true;
      }
    });
  };

  const countTodos = todos.filter(t => !t.completed).length;

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
              autoFocus
              ref={titleField}
              value={title}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              disabled={loading || isDisabled}
              onChange={handleTitleChange}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {/* This is a completed todo */}
          {todosFilters().map(todo => (
            <div
              key={todo.id}
              data-cy="Todo"
              className={classNames('todo', {
                completed: todo.completed === true,
              })}
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

              {/* Remove button appears only on hover */}
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => handleDeleteTodo(todo.id)}
              >
                ×
              </button>

              {/* overlay will cover the todo while it is being deleted or updated */}
              <div
                data-cy="TodoLoader"
                className={classNames('modal overlay', {
                  'is-active': loadingIds.includes(todo.id),
                })}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          ))}

          {tempTodo && <TempTodo todo={tempTodo} />}
        </section>

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {countTodos} items left
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={classNames('filter__link', {
                  selected: filter === 'all',
                })}
                data-cy="FilterLinkAll"
                onClick={() => setFilter('all')}
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames('filter__link', {
                  selected: filter === 'active',
                })}
                data-cy="FilterLinkActive"
                onClick={() => setFilter('active')}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={classNames('filter__link', {
                  selected: filter === 'completed',
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => {
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
              disabled={todos.filter(t => t.completed).length === 0}
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
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
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
