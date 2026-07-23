/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useMemo, useRef } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  getTodos,
  addTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { FilterStatus } from './types/FilterStatus';
import { ErrorMessage } from './types/ErrorMessage';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.All);

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timeoutId = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const showError = (message: string) => {
    setErrorMessage(message);

    if (timeoutId.current) {
      window.clearTimeout(timeoutId.current);
    }

    timeoutId.current = window.setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  const hideError = () => {
    if (timeoutId.current) {
      window.clearTimeout(timeoutId.current);
    }
    setErrorMessage('');
  };

  useEffect(() => {
    hideError();

    getTodos()
      .then(setTodos)
      .catch(() => showError(ErrorMessage.Load));
  }, []);

  const handleAddTodo = async (title: string) => {
    hideError();
    setIsSubmitting(true);

    const newTempTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempTodo(newTempTodo);

    try {
      const createdTodo = await addTodo({
        userId: USER_ID,
        title,
        completed: false,
      });

      setTodos(prev => [...prev, createdTodo]);
    } catch {
      showError(ErrorMessage.Add);
      throw new Error();
    } finally {
      setTempTodo(null);
      setIsSubmitting(false);
      focusInput();
    }
  };

  const handleDeleteTodo = (id: number): Promise<void> => {
    hideError();
    setLoadingIds(prev => [...prev, id]);

    return deleteTodo(id)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
      })
      .catch(error => {
        showError(ErrorMessage.Delete);
        throw error;
      })
      .finally(() => {
        setLoadingIds(prev => prev.filter(loadingId => loadingId !== id));
        focusInput();
      });
  };

  const handleToggleTodo = (todo: Todo) => {
    hideError();
    setLoadingIds(prev => [...prev, todo.id]);

    updateTodo({ id: todo.id, completed: !todo.completed })
      .then(updated => {
        setTodos(prev => prev.map(t => (t.id === todo.id ? updated : t)));
      })
      .catch(() => {
        showError(ErrorMessage.Update);
      })
      .finally(() => {
        setLoadingIds(prev => prev.filter(id => id !== todo.id));
      });
  };

  const handleUpdateTodo = async (todo: Todo, newTitle: string) => {
    hideError();
    setLoadingIds(prev => [...prev, todo.id]);

    try {
      const updated = await updateTodo({ id: todo.id, title: newTitle });

      setTodos(prev => prev.map(t => (t.id === todo.id ? updated : t)));
    } catch {
      showError(ErrorMessage.Update);
      throw new Error();
    } finally {
      setLoadingIds(prev => prev.filter(id => id !== todo.id));
    }
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(t => t.completed);

    completedTodos.forEach(todo => {
      handleDeleteTodo(todo.id).catch(() => {});
    });
  };

  const handleToggleAll = () => {
    const isAllCompleted = todos.every(t => t.completed);
    const targetTodos = isAllCompleted
      ? todos
      : todos.filter(t => !t.completed);

    targetTodos.forEach(todo => {
      hideError();
      setLoadingIds(prev => [...prev, todo.id]);

      updateTodo({ id: todo.id, completed: !isAllCompleted })
        .then(updated => {
          setTodos(prev => prev.map(t => (t.id === todo.id ? updated : t)));
        })
        .catch(() => {
          showError(ErrorMessage.Update);
        })
        .finally(() => {
          setLoadingIds(prev => prev.filter(id => id !== todo.id));
        });
    });
  };

  const visibleTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filter) {
        case FilterStatus.Active:
          return !todo.completed;
        case FilterStatus.Completed:
          return todo.completed;
        default:
          return true;
      }
    });
  }, [todos, filter]);

  const activeCount = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );

  const completedCount = todos.length - activeCount;
  const isAllCompleted = todos.length > 0 && activeCount === 0;

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          focusRef={inputRef}
          isAllCompleted={isAllCompleted}
          hasTodos={todos.length > 0}
          onAddTodo={handleAddTodo}
          onToggleAll={handleToggleAll}
          isSubmitting={isSubmitting}
          onError={showError}
        />

        {(todos.length > 0 || tempTodo) && (
          <TodoList
            todos={visibleTodos}
            tempTodo={tempTodo}
            loadingIds={loadingIds}
            onDelete={handleDeleteTodo}
            onToggle={handleToggleTodo}
            onUpdate={handleUpdateTodo}
          />
        )}

        {todos.length > 0 && (
          <Footer
            activeCount={activeCount}
            completedCount={completedCount}
            filter={filter}
            onFilterChange={setFilter}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !errorMessage,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={hideError}
        />
        {errorMessage}
      </div>
    </div>
  );
};
