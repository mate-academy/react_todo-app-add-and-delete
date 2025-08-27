import React, { useEffect, useMemo, useRef, useState } from 'react';
import cn from 'classnames';

import { USER_ID, Todo, getTodos, createTodo, deleteTodo } from './api/todos';

import { NewTodo } from './components/NewTodo/NewTodo';
import { TodoList } from './components/TodoList/TodoList';
import { Filter, FilterBy } from './components/Filter/Filter';
import { UserWarning } from './components/UserWarning';

export const App: React.FC = () => {
  // data
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // UI / UX
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // create / delete state
  const [creating, setCreating] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());
  const [newTitle, setNewTitle] = useState('');

  // filter
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.All);

  // input DOM ref (for focus requirements)
  const inputRef = useRef<HTMLInputElement>(null);
  const errorTimerRef = useRef<number | null>(null);

  // helpers
  const showErrorMsg = (msg: string) => {
    setError(msg);
    setShowError(true);

    if (errorTimerRef.current !== null) {
      window.clearTimeout(errorTimerRef.current);
    }

    errorTimerRef.current = window.setTimeout(() => {
      setShowError(false);
      setError(null);
      errorTimerRef.current = null;
    }, 3000);
  };

  // load todos once
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setShowError(false);
      setError(null);

      try {
        const data = await getTodos(USER_ID);

        if (!cancelled) {
          setTodos(data);
        }
      } catch {
        if (!cancelled) {
          showErrorMsg('Unable to load todos');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
      if (errorTimerRef.current !== null) {
        window.clearTimeout(errorTimerRef.current);
      }
    };
  }, []);

  // derived
  const filteredTodos = useMemo(() => {
    switch (filterBy) {
      case FilterBy.Active:
        return todos.filter(t => !t.completed);
      case FilterBy.Completed:
        return todos.filter(t => t.completed);
      default:
        return todos;
    }
  }, [todos, filterBy]);

  const activeCount = useMemo(
    () => todos.filter(t => !t.completed).length,
    [todos],
  );

  const hasCompleted = useMemo(() => todos.some(t => t.completed), [todos]);

  // ADD — call API immediately so the test sees the request
  const handleCreate = async (raw: string) => {
    const title = raw.trim();

    if (!title) {
      showErrorMsg('Title should not be empty');

      return;
    }

    // show temp row and disable input
    const temp: Todo = { id: 0, userId: USER_ID, title, completed: false };

    setTempTodo(temp);
    setCreating(true);
    setShowError(false);

    try {
      // IMPORTANT: send request immediately (no artificial delay)
      const created = await createTodo(USER_ID, { title, completed: false });

      // success → add real todo and clear field
      setTodos(prev => [...prev, created]);
      setNewTitle(''); // clear only on success
    } catch {
      showErrorMsg('Unable to add a todo'); // keep typed text
    } finally {
      setCreating(false);
      setTempTodo(null);
      inputRef.current?.focus();
    }
  };

  // DELETE one
  const handleDelete = async (todo: Todo) => {
    setShowError(false);
    setError(null);

    setDeletingIds(prev => new Set(prev).add(todo.id));
    try {
      await deleteTodo(todo.id);
      setTodos(prev => prev.filter(t => t.id !== todo.id));
    } catch {
      showErrorMsg('Unable to delete a todo');
    } finally {
      setDeletingIds(prev => {
        const next = new Set(prev);

        next.delete(todo.id);

        return next;
      });
      inputRef.current?.focus();
    }
  };

  // CLEAR COMPLETED (spec treats as multiple individual deletions)
  const handleClearCompleted = async () => {
    const completed = todos.filter(t => t.completed);

    if (completed.length === 0) {
      return;
    }

    // mark all as “deleting”
    setDeletingIds(prev => {
      const next = new Set(prev);

      completed.forEach(t => next.add(t.id));

      return next;
    });

    const results = await Promise.allSettled(
      completed.map(t => deleteTodo(t.id)),
    );

    // remove success, keep failures
    const failedIds = new Set<number>();

    completed.forEach((t, i) => {
      if (results[i].status === 'rejected') {
        failedIds.add(t.id);
      }
    });

    setTodos(prev => prev.filter(t => !t.completed || failedIds.has(t.id)));

    // update deleting flags
    setDeletingIds(prev => {
      const next = new Set(prev);

      completed.forEach(t => next.delete(t.id));

      return next;
    });

    if (failedIds.size > 0) {
      showErrorMsg('Unable to delete a todo');
    } else {
      inputRef.current?.focus();
    }
  };

  return (
    <div className="todoapp" aria-busy={isLoading}>
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <NewTodo
            value={newTitle}
            onChange={setNewTitle}
            disabled={creating}
            onCreate={handleCreate}
            inputRef={inputRef}
          />
        </header>

        <TodoList
          todos={filteredTodos}
          loadingIds={deletingIds}
          disableActions={creating}
          tempTodo={tempTodo}
          onDelete={handleDelete}
        />

        {todos.length > 0 && (
          <footer className="todoapp__footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeCount} items left
            </span>

            <Filter active={filterBy} onChange={setFilterBy} />

            <button
              type="button"
              className={cn('todoapp__clear-completed')}
              data-cy="ClearCompletedButton"
              disabled={!hasCompleted}
              onClick={handleClearCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <UserWarning
        hidden={!showError}
        message={error ?? ''}
        onClose={() => setShowError(false)}
      />
    </div>
  );
};
