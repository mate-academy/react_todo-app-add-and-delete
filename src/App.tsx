/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useRef } from 'react';
import cn from 'classnames';

import { USER_ID } from './api/todos';
import {
  Todo,
  FilterStatus,
  ErrorMessage,
  TODO_FILTER_NAV_CONFIG,
} from './types';
import { getVisibleTodos } from './utils/getVisibleTodos';

import * as todoService from './api/todos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.All);
  const [query, setQuery] = useState('');
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  const haveTodos = todos.length > 0;
  const activeTodosCount = todos.filter(t => !t.completed).length;
  const completedTodosCount = todos.filter(t => t.completed).length;

  function handleError(message: string) {
    setError(message);

    setTimeout(() => {
      setError('');
    }, 3000);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function handleStatusSwitch(todoId: number, todoStatus: boolean) {}

  function handleErrorReset() {
    setError('');
  }

  function handleDeleteTodo(todoId: number) {
    setDeletingTodoIds(current => [...current, todoId]);

    todoService
      .deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        handleError(ErrorMessage.DeleteTodoFailed);
      })
      .finally(() => {
        setDeletingTodoIds(current => current.filter(id => id !== todoId));
        inputRef.current?.focus();
      });
  }

  function handleCreateTodo(event: React.FormEvent) {
    event.preventDefault();

    const trimmedTitle = query.trim();

    if (trimmedTitle.length === 0) {
      handleError(ErrorMessage.EmptyTitle);

      return;
    }

    setLoading(true);

    const newTempTodo: Todo = {
      id: 0,
      title: trimmedTitle,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo(newTempTodo);

    todoService
      .createTodo({ title: trimmedTitle, userId: USER_ID, completed: false })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setQuery('');
      })
      .catch(() => {
        handleError(ErrorMessage.AddTodoFailed);
      })
      .finally(() => {
        setLoading(false);
        setTempTodo(null);
      });
  }

  useEffect(() => {
    setError('');
    setLoading(true);
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        handleError(ErrorMessage.LoadTodoFailed);
      })
      .finally(() => {
        setLoading(false);
        inputRef.current?.focus();
      });
  }, []);

  useEffect(() => {
    if (!loading && !tempTodo && inputRef.current) {
      inputRef.current.focus();
    }
  }, [loading, tempTodo]);

  const visibleTodos = getVisibleTodos(todos, filter);

  function handleClearCompleted() {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => {
      handleDeleteTodo(todo.id);
    });
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

          <form onSubmit={handleCreateTodo}>
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              disabled={loading}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {visibleTodos.map(todo => {
            const isDeleting = deletingTodoIds.includes(todo.id);

            return (
              <div
                data-cy="Todo"
                className={cn('todo', { completed: todo.completed })}
                key={todo.id}
              >
                <label className="todo__status-label">
                  <input
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                    checked={todo.completed}
                    onClick={() => handleStatusSwitch(todo.id, todo.completed)}
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
                  className={cn('modal overlay', { 'is-active': isDeleting })}
                >
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            );
          })}
        </section>

        {tempTodo && (
          <div data-cy="Todo" className="todo">
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

            <button type="button" className="todo__remove" data-cy="TodoDelete">
              ×
            </button>

            <div data-cy="TodoLoader" className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        )}

        {haveTodos && (
          <footer
            className={cn('todoapp__footer', { hidden: !haveTodos })}
            data-cy="Footer"
          >
            <span className="todo-count" data-cy="TodosCounter">
              {activeTodosCount} items left
            </span>

            <nav className="filter" data-cy="Filter">
              {TODO_FILTER_NAV_CONFIG.map(({ label, value, href, dataCy }) => (
                <a
                  key={value}
                  href={href}
                  className={cn('filter__link', {
                    selected: filter === value,
                  })}
                  onClick={() => setFilter(value)}
                  data-cy={dataCy}
                >
                  {label}
                </a>
              ))}
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={completedTodosCount === 0}
              onClick={handleClearCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !error },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => handleErrorReset()}
        />
        {error}
        <br />
      </div>
    </div>
  );
};
