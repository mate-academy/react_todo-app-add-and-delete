/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  getTodos,
  addTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';
import type { Todo } from './types/Todo';

type Filter = 'all' | 'active' | 'completed';

const NOTIF_MESSAGES = {
  load: 'Unable to load todos',
  add: 'Unable to add a todo',
  delete: 'Unable to delete a todo',
  update: 'Unable to update a todo',
  emptyTitle: 'Title should not be empty',
} as const;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<Filter>('all');
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const [adding, setAdding] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const notifRef = useRef<HTMLDivElement | null>(null);
  const newTodoRef = useRef<HTMLInputElement | null>(null);

  const hideNotification = useCallback(() => {
    notifRef.current?.classList.add('hidden');
  }, []);

  const showNotification = useCallback(
    (key: keyof typeof NOTIF_MESSAGES) => {
      const msg = NOTIF_MESSAGES[key];

      if (notifRef.current) {
        const btn = notifRef.current.querySelector(
          '[data-cy="HideErrorButton"]',
        ) as HTMLElement | null;

        notifRef.current.textContent = '';

        if (btn) {
          notifRef.current.appendChild(btn);
        }

        notifRef.current.append(msg);
        notifRef.current.classList.remove('hidden');
      }

      window.setTimeout(() => hideNotification(), 3000);
    },
    [hideNotification],
  );

  // hash
  useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash.replace('#', '');

      switch (hash) {
        case '/active':
          setFilter('active');
          break;
        case '/completed':
          setFilter('completed');
          break;
        default:
          setFilter('all');
      }
    };

    applyHash();
    window.addEventListener('hashchange', applyHash);

    return () => window.removeEventListener('hashchange', applyHash);
  }, []);

  useEffect(() => {
    newTodoRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    let cancelled = false;
    const load = async () => {
      hideNotification();
      setLoading(true);

      try {
        const data = await getTodos();

        if (!cancelled) {
          setTodos(Array.isArray(data) ? data : []);
        }
      } catch {
        if (!cancelled) {
          showNotification('load');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [showNotification, hideNotification]);

  const activeCount = todos.filter(t => !t.completed).length;
  const completedCount = todos.length - activeCount;

  const visibleTodos = todos.filter(todo => {
    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  // processing
  const startProcessing = (id: number) =>
    setProcessingIds(prev => (prev.includes(id) ? prev : [...prev, id]));
  const stopProcessing = (id: number) =>
    setProcessingIds(prev => prev.filter(x => x !== id));
  const isProcessing = (id: number) => processingIds.includes(id);

  // handlers
  const handleAdd = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      hideNotification();
      const input = newTodoRef.current;

      if (!input) {
        return;
      }

      const raw = input.value;
      const title = raw.trim();

      if (!title) {
        showNotification('emptyTitle');
        input.focus();

        return;
      }

      const temp: Todo = {
        id: 0,
        userId: USER_ID,
        title,
        completed: false,
      };

      setTempTodo(temp);
      setAdding(true);
      try {
        const created = await addTodo(title);

        setTodos(prev => [created, ...prev]);
        input.value = '';
        setTempTodo(null);
        input.focus();
      } catch {
        showNotification('add');
        setTempTodo(null);
        input.focus();
      } finally {
        setAdding(false);
      }
    },
    [hideNotification, showNotification],
  );

  const handleDelete = useCallback(
    async (todoId: number) => {
      hideNotification();
      startProcessing(todoId);
      try {
        await deleteTodo(todoId);
        setTodos(prev => prev.filter(t => t.id !== todoId));
      } catch {
        showNotification('delete');
      } finally {
        stopProcessing(todoId);
      }
    },
    [hideNotification, showNotification],
  );

  const handleClearCompleted = useCallback(async () => {
    hideNotification();
    const completed = todos.filter(t => t.completed);

    if (completed.length === 0) {
      return;
    }

    const ids = completed.map(t => t.id);

    setProcessingIds(prev => Array.from(new Set([...prev, ...ids])));
    const promises = completed.map(t =>
      deleteTodo(t.id).then(
        () => ({ id: t.id, ok: true }),
        () => ({ id: t.id, ok: false }),
      ),
    );
    const results = await Promise.all(promises);
    const successIds = results.filter(r => r.ok).map(r => r.id);

    if (successIds.length > 0) {
      setTodos(prev => prev.filter(t => !successIds.includes(t.id)));
    }

    const hasFail = results.some(r => !r.ok);

    if (hasFail) {
      showNotification('delete');
    }

    setProcessingIds(prev => prev.filter(id => !ids.includes(id)));
  }, [todos, hideNotification, showNotification]);

  const handleToggle = useCallback(
    async (todo: Todo) => {
      hideNotification();
      startProcessing(todo.id);
      try {
        const upd = await updateTodo(todo.id, {
          completed: !todo.completed,
        });

        setTodos(prev => prev.map(t => (t.id === upd.id ? upd : t)));
      } catch {
        showNotification('update');
      } finally {
        stopProcessing(todo.id);
      }
    },
    [hideNotification, showNotification],
  );

  const onHideError = useCallback(() => hideNotification(), [hideNotification]);

  return (
    <div className="todoapp">
      {!USER_ID ? <UserWarning /> : null}{' '}
      <h1 className="todoapp__title">todos</h1>{' '}
      <div className="todoapp__content">
        {' '}
        <header className="todoapp__header">
          <button
            type="button"
            className={`todoapp__toggle-all ${
              todos.length > 0 && activeCount === 0 ? 'active' : ''
            }`}
            data-cy="ToggleAllButton"
            disabled={loading || todos.length === 0}
          />{' '}
          <form onSubmit={handleAdd}>
            <input
              ref={newTodoRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              disabled={loading || adding}
            />{' '}
          </form>{' '}
        </header>
        {todos.length > 0 && (
          <section className="todoapp__main" data-cy="TodoList">
            {visibleTodos.map(todo => (
              <div
                key={todo.id}
                data-cy="Todo"
                className={`todo ${todo.completed ? 'completed' : ''}`}
              >
                {' '}
                <label className="todo__status-label">
                  <input
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                    checked={todo.completed}
                    onChange={() => handleToggle(todo)}
                    disabled={isProcessing(todo.id) || loading}
                  />{' '}
                </label>{' '}
                <span data-cy="TodoTitle" className="todo__title">
                  {todo.title}{' '}
                </span>
                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  disabled={loading || isProcessing(todo.id)}
                  onClick={() => handleDelete(todo.id)}
                >
                  ×{' '}
                </button>
                <div
                  data-cy="TodoLoader"
                  className={`modal overlay ${
                    isProcessing(todo.id) ? 'is-active' : ''
                  }`}
                >
                  {' '}
                  <div className="modal-background has-background-white-ter" />
                  {' '}
                  <div className="loader" />{' '}
                </div>{' '}
              </div>
            ))}{' '}
          </section>
        )}

        {tempTodo && (
          <section className="todoapp__main" aria-hidden>
            <div
              className={`todo ${tempTodo.completed ? 'completed' : ''}`}
              data-cy="Todo"
            >
              {' '}
              <label className="todo__status-label">
                {' '}
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={tempTodo.completed}
                  readOnly
                />{' '}
              </label>{' '}
              <span data-cy="TodoTitle" className="todo__title">
                {tempTodo.title}{' '}
              </span>{' '}
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                disabled
              >
                ×{' '}
              </button>{' '}
              <div data-cy="TodoLoader" className="modal overlay is-active">
                {' '}
                <div className="modal-background has-background-white-ter" />
                  {' '}
                <div className="loader" />{' '}
              </div>{' '}
            </div>{' '}
          </section>
        )}
        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            {' '}
            <span className="todo-count" data-cy="TodosCounter">
              {activeCount} {activeCount === 1 ? 'item' : 'items'} left{' '}
            </span>{' '}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={`filter__link ${filter === 'all' ? 'selected' : ''}`}
                data-cy="FilterLinkAll"
              >
                All{' '}
              </a>
              <a
                href="#/active"
                className={`filter__link ${
                  filter === 'active' ? 'selected' : ''
                }`}
                data-cy="FilterLinkActive"
              >
                Active{' '}
              </a>
              <a
                href="#/completed"
                className={`filter__link ${
                  filter === 'completed' ? 'selected' : ''
                }`}
                data-cy="FilterLinkCompleted"
              >
                Completed{' '}
              </a>{' '}
            </nav>
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={completedCount === 0 || loading}
              onClick={handleClearCompleted}
            >
              Clear completed{' '}
            </button>{' '}
          </footer>
        )}{' '}
      </div>{' '}
      <div
        data-cy="ErrorNotification"
        ref={notifRef}
        className=
          "notification is-danger is-light has-text-weight-normal hidden"
      >
        {' '}
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={onHideError}
        />{' '}
      </div>{' '}
    </div>
  );
};
