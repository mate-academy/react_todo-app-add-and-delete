import React, { useEffect, useRef, useState, useCallback } from 'react';
import cn from 'classnames';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos, createTodo, deleteTodo } from './api/todos';
import type { Todo } from './types/Todo';
import { Filter, FilterStatus } from './components/Filter';
import { Notification } from './components/Notification';
import { TodoList } from './components/TodoList';
import { getFilteredTodos } from './utils/getFilteredTodos';

const ERROR_MESSAGES = {
  EMPTY_TITLE: 'Title should not be empty',
  ADD_FAIL: 'Unable to add a todo',
  DELETE_FAIL: 'Unable to delete a todo',
  LOAD_FAIL: 'Unable to load todos',
} as const;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>(
    FilterStatus.All,
  );
  const [title, setTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [pendingIds, setPendingIds] = useState<number[]>([]);

  const newTodoInputRef = useRef<HTMLInputElement>(null);
  const hideErrorTimeoutIdRef = useRef<number | null>(null);

  const clearErrorTimer = useCallback(() => {
    if (hideErrorTimeoutIdRef.current) {
      window.clearTimeout(hideErrorTimeoutIdRef.current);
      hideErrorTimeoutIdRef.current = null;
    }
  }, []);

  const hideError = useCallback(() => {
    clearErrorTimer();
    setErrorMessage(null);
  }, [clearErrorTimer]);

  const showError = useCallback(
    (message: string) => {
      setErrorMessage(message);
      clearErrorTimer();
      hideErrorTimeoutIdRef.current = window.setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    },
    [clearErrorTimer],
  );

  useEffect(() => {
    newTodoInputRef.current?.focus();

    (async () => {
      try {
        const data = await getTodos();

        setTodos(data);
      } catch {
        showError(ERROR_MESSAGES.LOAD_FAIL);
      }
    })();

    return () => clearErrorTimer();
  }, [showError, clearErrorTimer]);

  const filteredTodos = getFilteredTodos(todos, filterStatus);
  const hasTodos = todos.length > 0;
  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  const handleFilterChange = (nextStatus: FilterStatus) => {
    setFilterStatus(nextStatus);
  };

  const handleErrorClose = () => {
    hideError();
    setTimeout(() => newTodoInputRef.current?.focus(), 0);
  };

  const handleNewTodoFormSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    const trimmed = title.trim();

    if (!trimmed) {
      showError(ERROR_MESSAGES.EMPTY_TITLE);

      return;
    }

    try {
      setIsAdding(true);
      setTempTodo({ id: 0, title: trimmed, completed: false, userId: USER_ID });
      const created = await createTodo(trimmed);

      setTodos(curr => [...curr, created]);
      setTitle('');
    } catch {
      showError(ERROR_MESSAGES.ADD_FAIL);
    } finally {
      setTempTodo(null);
      setIsAdding(false);
      setTimeout(() => newTodoInputRef.current?.focus(), 0);
    }
  };

  const handleDelete = async (id: number) => {
    setPendingIds(prev => (prev.includes(id) ? prev : [...prev, id]));

    try {
      await deleteTodo(id);
      setTodos(curr => curr.filter(t => t.id !== id));
    } catch {
      showError(ERROR_MESSAGES.DELETE_FAIL);
    } finally {
      setPendingIds(prev => prev.filter(x => x !== id));
      setTimeout(() => newTodoInputRef.current?.focus(), 0);
    }
  };

  const handleClearCompleted = async () => {
    const completedIds = todos.filter(t => t.completed).map(t => t.id);

    if (completedIds.length === 0) {
      return;
    }

    setPendingIds(prev => Array.from(new Set([...prev, ...completedIds])));

    const results = await Promise.allSettled(
      completedIds.map(id => deleteTodo(id)),
    );

    const successIds: number[] = [];
    const failedIds: number[] = [];

    results.forEach((res, i) => {
      const id = completedIds[i];

      if (res.status === 'fulfilled') {
        successIds.push(id);
      } else {
        failedIds.push(id);
      }
    });

    if (failedIds.length) {
      showError(ERROR_MESSAGES.DELETE_FAIL);
    }

    setTodos(curr => curr.filter(t => !successIds.includes(t.id)));

    setPendingIds(prev => prev.filter(id => !completedIds.includes(id)));

    setTimeout(() => newTodoInputRef.current?.focus(), 0);
  };

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
            data-cy="ToggleAllButton"
            className={cn('todoapp__toggle-all', {
              active: activeTodosCount === 0 && hasTodos,
            })}
            disabled
            aria-label="toggle all"
          />

          <form onSubmit={handleNewTodoFormSubmit}>
            <input
              ref={newTodoInputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={({ target: { value } }) => setTitle(value)}
              disabled={isAdding}
              autoFocus
            />
          </form>
        </header>

        {(hasTodos || tempTodo) && (
          <TodoList
            todos={filteredTodos}
            tempTodo={tempTodo}
            pendingIds={pendingIds}
            onDelete={handleDelete}
          />
        )}

        {hasTodos && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeTodosCount} items left
            </span>

            <Filter value={filterStatus} onChange={handleFilterChange} />

            <button
              data-cy="ClearCompletedButton"
              className="todoapp__clear-completed"
              disabled={!todos.some(t => t.completed)}
              type="button"
              onClick={handleClearCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <Notification message={errorMessage} onClose={handleErrorClose} />
    </div>
  );
};
