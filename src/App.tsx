/* eslint-disable max-len */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';

import { UserWarning } from './UserWarning';
import { getTodos, USER_ID, createTodo, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const inputRef = useRef<HTMLInputElement>(null);
  const errorTimer = useRef<number | null>(null);

  const showError = (message: string) => {
    setErrorMessage(message);

    if (errorTimer.current) {
      clearTimeout(errorTimer.current);
    }

    errorTimer.current = window.setTimeout(() => {
      setErrorMessage('');
      errorTimer.current = null;
    }, 3000);
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        showError('Unable to load todos');
      });
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const title = newTitle.trim();

    if (!title) {
      showError('Title should not be empty');

      return;
    }

    const temp: Todo = {
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempTodo(temp);

    try {
      const created = await createTodo({
        userId: USER_ID,
        title,
        completed: false,
      });

      setTodos(prev => [...prev, created]);
      setNewTitle('');
      setTempTodo(null);

      setTimeout(() => {
        inputRef.current?.focus();
      });
    } catch {
      showError('Unable to add a todo');
      setTempTodo(null);

      setTimeout(() => {
        inputRef.current?.focus();
      });
    }
  };

  const handleDelete = async (todoId: number) => {
    setLoadingIds(prev => [...prev, todoId]);

    try {
      await deleteTodo(todoId);

      setTodos(prev => prev.filter(todo => todo.id !== todoId));

      setTimeout(() => {
        inputRef.current?.focus();
      });
    } catch {
      showError('Unable to delete a todo');
    } finally {
      setLoadingIds(prev => prev.filter(id => id !== todoId));
    }
  };

  const clearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    await Promise.allSettled(completedTodos.map(todo => handleDelete(todo.id)));
  };

  const visibleTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const activeCount = todos.filter(todo => !todo.completed).length;

  const hasCompleted = todos.some(todo => todo.completed);

  if (!USER_ID) {
    return <UserWarning />;
  }

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

          <form onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              autoFocus
              disabled={tempTodo !== null}
            />
          </form>
        </header>

        {(todos.length > 0 || tempTodo) && (
          <section className="todoapp__main" data-cy="TodoList">
            {visibleTodos.map(todo => {
              const isLoading = loadingIds.includes(todo.id);

              return (
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
                      aria-label={`Toggle ${todo.title}`}
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

                  <div
                    data-cy="TodoLoader"
                    className={classNames('modal', {
                      overlay: isLoading,
                      'is-active': isLoading,
                    })}
                  >
                    <div className="modal-background has-background-white-ter" />
                    <div className="loader" />
                  </div>
                </div>
              );
            })}

            {tempTodo && (
              <div data-cy="Todo" className="todo">
                <span data-cy="TodoTitle" className="todo__title">
                  {tempTodo.title}
                </span>

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
              {activeCount} items left
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                data-cy="FilterLinkAll"
                className={classNames('filter__link', {
                  selected: filter === 'all',
                })}
                onClick={() => setFilter('all')}
              >
                All
              </a>

              <a
                href="#/active"
                data-cy="FilterLinkActive"
                className={classNames('filter__link', {
                  selected: filter === 'active',
                })}
                onClick={() => setFilter('active')}
              >
                Active
              </a>

              <a
                href="#/completed"
                data-cy="FilterLinkCompleted"
                className={classNames('filter__link', {
                  selected: filter === 'completed',
                })}
                onClick={() => setFilter('completed')}
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={!hasCompleted}
              onClick={clearCompleted}
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
