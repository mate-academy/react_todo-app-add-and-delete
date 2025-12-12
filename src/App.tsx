/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { client } from './utils/fetchClient';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer';
import { Filter } from './types/Filter';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());
  const [creating, setCreating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const timeoutRef = useRef<number | null>(null);
  const [title, setTitle] = useState<string>('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  const filteredTodos = useMemo<Todo[]>(() => {
    if (filter === Filter.All) {
      return todos;
    }

    if (filter === Filter.Active) {
      return todos.filter(t => !t.completed);
    }

    if (filter === Filter.Completed) {
      return todos.filter(t => t.completed);
    }

    return todos;
  }, [todos, filter]);

  const showError = (message: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = null;

    setError(message);

    timeoutRef.current = window.setTimeout(() => {
      setError(null);
      timeoutRef.current = null;
    }, 3000);
  };

  useEffect(() => {
    inputRef.current?.focus();

    setLoading(true);

    client
      .get<Todo[]>(`/todos?userId=${USER_ID}`)
      .then(setTodos)
      .catch(() => showError('Unable to load todos'))
      .finally(() => {
        setLoading(false);
      });

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!creating) {
      inputRef.current?.focus();
    }
  }, [creating]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleAddTodo = () => {
    const trimmed = title.trim();

    if (!trimmed) {
      showError('Title should not be empty');

      return;
    }

    setError(null);
    setCreating(true);

    const temp = {
      id: 0,
      title: trimmed,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(temp);

    client
      .post<Todo>('/todos', {
        title: trimmed,
        completed: false,
        userId: USER_ID,
      })
      .then(newTodo => {
        setTodos(prev => [...prev, newTodo]);
        setTitle('');
      })
      .catch(() => showError('Unable to add a todo'))
      .finally(() => {
        setTempTodo(null);
        setCreating(false);
      });
  };

  const handleToggle = async (todo: Todo) => {
    setLoadingIds(prev => {
      const next = new Set(prev);

      next.add(String(todo.id));

      return next;
    });

    try {
      const updated = await client.patch<Todo>(`/todos/${todo.id}`, {
        ...todo,
        completed: !todo.completed,
      });

      setTodos(prev => prev.map(t => (t.id === todo.id ? updated : t)));
    } catch (err) {
      showError('Could not update todo');
    } finally {
      setLoadingIds(prev => {
        const next = new Set(prev);

        next.delete(String(todo.id));

        return next;
      });
    }
  };

  const handleDelete = async (id: string) => {
    setLoadingIds(prev => new Set(prev).add(id));
    try {
      await client.delete(`/todos/${id}`);
      setTodos(prev => prev.filter(t => String(t.id) !== id));
      inputRef.current?.focus();
    } catch {
      showError('Unable to delete a todo');
    } finally {
      setLoadingIds(prev => {
        const next = new Set(prev);

        next.delete(id);

        return next;
      });
    }
  };

  const handleClearCompleted = async () => {
    const completed = todos.filter(t => t.completed);

    if (completed.length === 0) {
      return;
    }

    setLoadingIds(prev => {
      const next = new Set(prev);

      completed.forEach(t => next.add(String(t.id)));

      return next;
    });

    const requests = completed.map(t => client.delete(`/todos/${t.id}`));
    const results = await Promise.allSettled(requests);

    const successfulIds = new Set(
      completed
        .filter((_, i) => results[i].status === 'fulfilled')
        .map(t => String(t.id)),
    );

    setTodos(prev => prev.filter(t => !successfulIds.has(String(t.id))));
    inputRef.current?.focus();

    if (results.some(r => r.status === 'rejected')) {
      showError('Unable to delete a todo');
    }

    setLoadingIds(prev => {
      const next = new Set(prev);

      completed.forEach(t => next.delete(String(t.id)));

      return next;
    });
  };

  const handleHideError = () => {
    setError(null);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const activeCount = todos.filter(t => !t.completed).length;
  const completedCount = todos.length - activeCount;
  const allCompleted = todos.length > 0 && todos.every(t => t.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          value={title}
          onChange={(v: string) => setTitle(v)}
          onAddTodo={handleAddTodo}
          onToggleAll={() => {}}
          loading={creating}
          allCompleted={allCompleted}
          inputRef={inputRef}
        />

        <TodoList
          todos={filteredTodos}
          loading={loading}
          loadingIds={loadingIds}
          onToggle={handleToggle}
          onDelete={handleDelete}
          tempTodo={tempTodo}
        />
        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            activeCount={activeCount}
            completedCount={completedCount}
            filter={filter}
            setFilter={setFilter}
            onClearCompleted={handleClearCompleted}
          />
        )}

        <div
          className={`modal overlay ${creating ? 'is-active' : ''}`}
          data-cy="TempTodoLoader"
        />
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification error={error} onHideError={handleHideError} />
    </div>
  );
};
