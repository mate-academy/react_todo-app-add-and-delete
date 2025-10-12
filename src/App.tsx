/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { addTodo, getTodos, removeTodo, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { Filter } from './types/Filter';
import { TodoFooter } from './components/TodosFooter';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  //#region state
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [title, setTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  //local uninstall loaders
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());
  //#endregion

  //#region filter by hash
  useEffect(() => {
    const applyHash = () => {
      const h = window.location.hash.replace('#/', '');

      if (h === 'active' || h === 'completed') {
        setFilter(h);
      } else {
        setFilter('all');
      }
    };

    applyHash();
    window.addEventListener('hashchange', applyHash);

    return () => window.removeEventListener('hashchange', applyHash);
  }, []);
  //#endregion

  //#region task loader
  const showError = (message: string) => {
    setError(message);
    window.setTimeout(() => setError(''), 3000);
  };

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    let timer: number | undefined;

    setIsLoading(true);
    setError('');

    getTodos()
      .then(setTodos)
      .catch(() => showError('Unable to load todos'))
      .finally(() => setIsLoading(false));

    return () => {
      if (timer) {
        window.clearTimeout(timer);
      }
    };
  }, []);

  const activeCount = useMemo(
    () => todos.filter(t => !t.completed).length,
    [todos],
  );

  const completedExist = useMemo(() => todos.some(t => t.completed), [todos]);

  const allCompleted = todos.length > 0 && activeCount === 0;

  const filteredTodos = useMemo<Todo[]>(() => {
    if (filter === 'active') {
      return todos.filter(t => !t.completed);
    }

    if (filter === 'completed') {
      return todos.filter(t => t.completed);
    }

    return todos;
  }, [todos, filter]);

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);
  // #endregion

  // #region show error and submit
  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = title.trim();

    if (!trimmed) {
      showError('Title should not be empty');

      return;
    }

    setIsAdding(true);
    setTempTodo({ id: 0, userId: USER_ID, title: trimmed, completed: false });

    addTodo(trimmed)
      .then(created => {
        setTodos(prev => [...prev, created]);
        setTitle('');
      })
      .catch(() => {
        showError('Unable to add a todo');
      })
      .finally(() => {
        setIsAdding(false);
        setTempTodo(null);
        setTimeout(() => inputRef.current?.focus(), 0);
      });
  };
  // #endregion

  // #region show error delete
  const startDeleting = (ids: number[]) =>
    setDeletingIds(prev => {
      const next = new Set(prev);

      ids.forEach(id => next.add(id));

      return next;
    });

  const stopDeleting = (ids: number[]) =>
    setDeletingIds(prev => {
      const next = new Set(prev);

      ids.forEach(id => next.delete(id));

      return next;
    });

  const handleDeleteOne = (id: number) => {
    startDeleting([id]);

    removeTodo(id)
      .then(() => {
        setTodos(prev => prev.filter(t => t.id !== id));
      })
      .catch(() => {
        showError('Unable to delete a todo');
      })
      .finally(() => {
        stopDeleting([id]);
        setTimeout(() => inputRef.current?.focus(), 0);
      });
  };

  const handleClearCompleted = () => {
    const ids = todos.filter(t => t.completed).map(t => t.id);

    if (ids.length === 0) {
      return;
    }

    startDeleting(ids);

    Promise.allSettled(
      ids.map(id =>
        removeTodo(id)
          .then(() => {
            setTodos(prev => prev.filter(t => t.id !== id));
          })
          .catch(() => {
            showError('Unable to delete a todo');
          }),
      ),
    )
      .then(results => {
        const hadFail = results.some(r => r.status === 'rejected');

        if (!hadFail) {
          setTimeout(() => inputRef.current?.focus(), 0);
        }
      })
      .finally(() => {
        stopDeleting(ids);
      });
  };

  // #endregion

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          title={title}
          isLoading={isLoading}
          isAdding={isAdding}
          allCompleted={allCompleted}
          onAdd={handleAdd}
          onChangeTitle={setTitle}
          inputRef={inputRef}
        />

        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          deletingIds={deletingIds}
          isLoading={isLoading}
          onDelete={handleDeleteOne}
        />
        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <TodoFooter
            activeCount={activeCount}
            completedExist={completedExist}
            deletingInProgress={deletingIds.size > 0}
            filter={filter}
            onClear={handleClearCompleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification message={error} onHide={() => setError('')} />
    </div>
  );
};
