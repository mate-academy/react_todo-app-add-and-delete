/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { NotificationMessage } from './types/Notifications';
import { Header } from './Components/Header';
import { MainSection } from './Components/MainSection';
import { Footer } from './Components/Footer';
import { ErrorNotification } from './Components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [creating, setCreating] = useState(false);
  const [processings, setProcessings] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    message: NotificationMessage | null;
    visible: boolean;
  }>({ message: null, visible: false });

  const [filter, setFilter] = useState<Filter>(Filter.ALL);

  const [newTodoText, setNewTodoText] = useState<string>('');

  const notificationTimeoutRef = useRef<number | null>(null);
  const newTodoRef = useRef<HTMLInputElement | null>(null);
  const remaining = todos.filter(item => !item.completed).length;
  const hasCompleted = todos.some(item => item.completed);

  const hideNotification = useCallback(() => {
    if (notificationTimeoutRef.current) {
      window.clearTimeout(notificationTimeoutRef.current);
      notificationTimeoutRef.current = null;
    }

    setNotification({ message: null, visible: false });
  }, []);

  const showNotification = useCallback(
    (message: NotificationMessage) => {
      hideNotification();
      setNotification({ message, visible: true });
      notificationTimeoutRef.current = window.setTimeout(() => {
        setNotification({ message, visible: false });
        notificationTimeoutRef.current = null;
      }, 3000);
    },
    [hideNotification],
  );

  useEffect(() => {
    async function load() {
      hideNotification();
      setLoading(true);
      try {
        const loadedTodos = await getTodos();

        setTodos(loadedTodos);
      } catch (err) {
        showNotification(NotificationMessage.UnableToLoadTodos);
      } finally {
        setLoading(false);
      }
    }

    load();

    return () => {
      hideNotification();
    };
  }, [hideNotification, showNotification]);

  const visibleTodos = useMemo(() => {
    switch (filter) {
      case Filter.ACTIVE: {
        return todos.filter(item => !item.completed);
      }

      case Filter.COMPLETED: {
        return todos.filter(item => item.completed);
      }

      default:
        return todos;
    }
  }, [todos, filter]);

  const allCompleted = todos.length > 0 && todos.every(item => item.completed);

  async function handleAddTodo(e: React.FormEvent) {
    e.preventDefault();
    if (creating) {
      return;
    }

    const title = newTodoText.trim();

    if (!title) {
      showNotification(NotificationMessage.TitleEmpty);

      return;
    }

    setCreating(true);
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    });

    try {
      const createdTodo = await createTodo({
        title,
        userId: USER_ID,
        completed: false,
      });

      setNewTodoText('');

      setTodos(prev => [...prev, createdTodo]);
    } catch (error) {
      showNotification(NotificationMessage.UnableToAdd);
    } finally {
      setTempTodo(null);
      setCreating(false);
      newTodoRef.current?.focus();
    }
  }

  async function handleToggleTodo(id: number) {
    const currentTodo = todos.find(t => t.id === id);

    if (!currentTodo) {
      return;
    }

    setProcessings(prev => (prev.includes(id) ? prev : [...prev, id]));
    hideNotification();
    try {
      const updated = await updateTodo(id, {
        completed: !currentTodo.completed,
      });

      setTodos(prev =>
        prev.map(t =>
          t.id === id
            ? { ...t, completed: updated?.completed ?? !currentTodo.completed }
            : t,
        ),
      );
    } catch {
      showNotification(NotificationMessage.UnableToUpdate);
    } finally {
      setProcessings(prev => prev.filter(pId => pId !== id));
    }
  }

  async function handleDeleteTodo(id: number) {
    hideNotification();
    setProcessings(prev => (prev.includes(id) ? prev : [...prev, id]));
    try {
      await deleteTodo(id);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
    } catch (error) {
      showNotification(NotificationMessage.UnableToDelete);
    } finally {
      setProcessings(prev => prev.filter(pId => pId !== id));
    }
  }

  function handleToggleAll() {
    hideNotification();
    setTodos(prev => prev.map(t => ({ ...t, completed: !allCompleted })));
  }

  const handleClearCompleted = () => {
    const completedIds = todos.filter(t => t.completed).map(t => t.id);

    completedIds.forEach(id => {
      void handleDeleteTodo(id);
    });
  };

  useEffect(() => {
    if (!creating && !loading && processings.length === 0) {
      const timer = setTimeout(() => {
        newTodoRef.current?.focus();
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [creating, loading, processings.length]);
  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          newTodoText={newTodoText}
          onChange={setNewTodoText}
          onSubmit={handleAddTodo}
          newTodoRef={newTodoRef}
          disabledInput={creating || loading || processings.length > 0}
          allCompleted={allCompleted}
          onToggleAll={handleToggleAll}
          disabledFooter={creating || loading || processings.length > 0}
        />

        {(visibleTodos.length > 0 || tempTodo) && (
          <MainSection
            processings={processings}
            visibleTodos={visibleTodos}
            loading={loading}
            tempTodo={tempTodo}
            onToggleTodo={handleToggleTodo}
            onDeleteTodo={handleDeleteTodo}
          />
        )}
        {todos.length > 0 && (
          <Footer
            todos={todos}
            remaining={remaining}
            filter={filter}
            setFilter={setFilter}
            hasCompleted={hasCompleted}
            clearCompleted={handleClearCompleted}
            disabledFooter={creating || loading || processings.length > 0}
          />
        )}
      </div>
      <ErrorNotification
        notification={notification}
        hideNotification={hideNotification}
      />
    </div>
  );
};
