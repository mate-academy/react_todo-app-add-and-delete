/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo, TodoFilter } from './types/Todo';
import * as todoApi from './api/todos';
import { TodoFooter } from './components/TodoFooter';
import { TodoList } from './components/TodoList';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<TodoFilter>(TodoFilter.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processings, setProcessings] = useState<Set<number>>(new Set());

  const timeRef = useRef<number | null>(null);
  const newTodoRef = useRef<HTMLInputElement>(null);
  const activeCount = todos.filter(t => !t.completed).length;

  useEffect(() => {
    if (!tempTodo) {
      newTodoRef.current?.focus();
    }
  }, [tempTodo]);

  const hideNotification = () => {
    if (timeRef.current) {
      clearTimeout(timeRef.current);
      timeRef.current = null;
    }

    setErrorMessage('');
  };

  const showNotification = useCallback((message: string) => {
    hideNotification();
    setErrorMessage(message);
    timeRef.current = window.setTimeout(hideNotification, 3000);
  }, []);

  const handleDeleteTodo = async (id: number) => {
    setTodos(prev =>
      prev.map(todo => (todo.id === id ? { ...todo, loading: true } : todo)),
    );
    setProcessings(prev => new Set(prev).add(id));

    try {
      await todoApi.deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
      setTimeout(() => newTodoRef.current?.focus(), 0);
    } catch {
      showNotification('Unable to delete a todo');
      setTodos(prev =>
        prev.map(todo => (todo.id === id ? { ...todo, loading: false } : todo)),
      );
    } finally {
      setProcessings(prev => {
        const copy = new Set(prev);

        copy.delete(id);

        return copy;
      });
    }
  };

  const handleClearCompleted = async () => {
    const completedIds = todos.filter(t => t.completed).map(t => t.id);

    if (!completedIds.length) {
      return;
    }

    setProcessings(prev => {
      const copy = new Set(prev);

      completedIds.forEach(id => copy.add(id));

      return copy;
    });

    const results = await Promise.allSettled(
      completedIds.map(id => todoApi.deleteTodo(id)),
    );

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        setTodos(prev => prev.filter(t => t.id !== completedIds[index]));
      } else {
        showNotification('Unable to delete a todo');
      }
    });

    setProcessings(prev => {
      const copy = new Set(prev);

      completedIds.forEach(id => copy.delete(id));

      return copy;
    });

    setTimeout(() => newTodoRef.current?.focus(), 0);
  };

  useEffect(() => {
    return () => {
      if (timeRef.current) {
        clearTimeout(timeRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const fetchTodos = async () => {
      hideNotification();
      setLoading(true);
      try {
        const data = await todoApi.getTodos();

        setTodos(data);
        newTodoRef.current?.focus();
      } catch {
        showNotification('Unable to load todos');
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, [showNotification]);

  if (!todoApi.USER_ID) {
    return <UserWarning />;
  }

  const handleAddTodo = async (event: React.FormEvent) => {
    event.preventDefault();
    const title = newTodoRef.current?.value.trim() || '';

    if (!title) {
      showNotification('Title should not be empty');

      return;
    }

    setTempTodo({
      id: 0,
      title,
      completed: false,
      userId: todoApi.USER_ID!,
      loading: true,
    });

    try {
      const newTodo = await todoApi.createTodo({
        title,
        completed: false,
        userId: todoApi.USER_ID!,
      });

      setTodos(prev => [...prev, newTodo]);
      newTodoRef.current!.value = '';
      setTimeout(() => newTodoRef.current?.focus(), 0);
    } catch {
      showNotification('Unable to add a todo');
    } finally {
      setTempTodo(null);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={`todoapp__toggle-all ${todos.length > 0 && activeCount === 0 ? 'active' : ''}`}
            data-cy="ToggleAllButton"
            disabled={loading || todos.length === 0}
          />
          <form onSubmit={handleAddTodo}>
            <input
              ref={newTodoRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              disabled={!!tempTodo}
            />
          </form>
        </header>

        <TodoList
          todos={todos}
          tempTodo={tempTodo}
          filter={filter}
          processings={processings}
          onDelete={handleDeleteTodo}
        />

        {todos.length > 0 && (
          <TodoFooter
            activeCount={activeCount}
            filter={filter}
            onFilterChange={setFilter}
            onClearCompleted={handleClearCompleted}
            hasCompleted={todos.some(t => t.completed)}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${errorMessage ? '' : 'hidden'}`}
        role="alert"
        aria-live="assertive"
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={hideNotification}
        />
        {errorMessage}
      </div>
    </div>
  );
};
