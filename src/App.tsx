/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createTodo, deleteTodo, getTodos, updateTodo } from './api/todos';
import { Todo } from './types';
import { NewTodo } from './NewTodo';
import { TodoList } from './TodoList';
import { Footer, FilterType } from './Footer';
import { ErrorNotification } from './ErrorNotification';
import { UserWarning } from './UserWarning';
import { TodoItem } from './TodoItem';

const USER_ID = 1;

const ERROR_MESSAGES = {
  emptyTitle: 'Title should not be empty',
  addFailed: 'Unable to add a todo',
  deleteFailed: 'Unable to delete a todo',
  loadFailed: 'Unable to load todos',
  updateFailed: 'Unable to update a todo',
};

const getFilterFromHash = (): FilterType => {
  switch (window.location.hash) {
    case '#/active':
      return 'active';
    case '#/completed':
      return 'completed';
    default:
      return 'all';
  }
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [focusKey, setFocusKey] = useState(0);

  const errorTimerId = useRef<number | null>(null);

  const clearErrorTimer = () => {
    if (errorTimerId.current !== null) {
      window.clearTimeout(errorTimerId.current);
      errorTimerId.current = null;
    }
  };

  const hideError = () => {
    clearErrorTimer();
    setError('');
  };

  const showError = (message: string) => {
    clearErrorTimer();
    setError(message);

    errorTimerId.current = window.setTimeout(() => {
      setError('');
      errorTimerId.current = null;
    }, 3000);
  };

  const focusInput = () => {
    setFocusKey(current => current + 1);
  };

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        showError(ERROR_MESSAGES.loadFailed);
      });

    return () => {
      clearErrorTimer();
    };
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      setFilter(getFilterFromHash());
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

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
  const hasTodosForFooter = todos.some(todo => !processingIds.includes(todo.id));

  const handleAddTodo = async () => {
    hideError();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      showError(ERROR_MESSAGES.emptyTitle);
      focusInput();
      return;
    }

    const optimisticTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo(optimisticTodo);

    try {
      const createdTodo = await createTodo({
        userId: USER_ID,
        title: trimmedTitle,
        completed: false,
      });

      setTodos(current => [...current, createdTodo]);
      setTitle('');
    } catch {
      showError(ERROR_MESSAGES.addFailed);
    } finally {
      setTempTodo(null);
      focusInput();
    }
  };

  const handleDeleteTodo = async (id: number) => {
    hideError();
    setProcessingIds(current => [...current, id]);

    try {
      await deleteTodo(id);
      setTodos(current => current.filter(todo => todo.id !== id));
    } catch {
      showError(ERROR_MESSAGES.deleteFailed);
    } finally {
      setProcessingIds(current => current.filter(todoId => todoId !== id));
      focusInput();
    }
  };

  const handleToggleTodo = async (id: number) => {
    hideError();
    setProcessingIds(current => [...current, id]);

    const currentTodo = todos.find(todo => todo.id === id);

    if (!currentTodo) {
      setProcessingIds(current => current.filter(todoId => todoId !== id));
      return;
    }

    try {
      const updatedTodo = await updateTodo(id, {
        completed: !currentTodo.completed,
      });

      setTodos(current =>
        current.map(todo => (todo.id === id ? updatedTodo : todo)),
      );
    } catch {
      showError(ERROR_MESSAGES.updateFailed);
    } finally {
      setProcessingIds(current => current.filter(todoId => todoId !== id));
    }
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => {
      handleDeleteTodo(todo.id);
    });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <NewTodo
            value={title}
            onChange={setTitle}
            onSubmit={handleAddTodo}
            disabled={tempTodo !== null}
            focusKey={focusKey}
          />
        </header>

        {todos.length > 0 && (
          <TodoList
            todos={visibleTodos}
            processingIds={processingIds}
            onDelete={handleDeleteTodo}
            onToggle={handleToggleTodo}
          />
        )}

        {tempTodo && <TodoItem todo={tempTodo} isProcessed />}

        {hasTodosForFooter && (
          <Footer
            activeCount={activeCount}
            hasCompleted={hasCompleted}
            currentFilter={filter}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        message={error}
        onClose={hideError}
      />
    </div>
  );
};













