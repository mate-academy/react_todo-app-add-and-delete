import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, createTodo, deleteTodo, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { ErrorMessage } from './types/ErrorMessage';
import { FilterStatus } from './types/FilterStatus';

import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [error, setError] = useState<ErrorMessage>(ErrorMessage.NONE);
  const [filter, setFilter] = useState<FilterStatus>('all');

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setError(ErrorMessage.UNABLE_TO_LOAD));
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(ErrorMessage.NONE), 3000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (!tempTodo) {
      inputRef.current?.focus();
    }
  }, [tempTodo, todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const title = newTitle.trim();

    if (!title) {
      setError(ErrorMessage.EMPTY_TITLE);

      return;
    }

    setTempTodo({ id: 0, title, completed: false, userId: USER_ID });

    try {
      const createdTodo = await createTodo({
        title,
        completed: false,
        userId: USER_ID,
      });

      setTodos(current => [...current, createdTodo]);
      setNewTitle('');
    } catch {
      setError(ErrorMessage.UNABLE_TO_ADD);
    } finally {
      setTempTodo(null);
    }
  };

  const handleDelete = async (todoId: number) => {
    setLoadingIds(prev => [...prev, todoId]);
    try {
      await deleteTodo(todoId);
      setTodos(current => current.filter(todo => todo.id !== todoId));
    } catch {
      setError(ErrorMessage.UNABLE_TO_DELETE);
    } finally {
      setLoadingIds(prev => prev.filter(id => id !== todoId));
    }
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(t => t.completed);

    completedTodos.forEach(t => handleDelete(t.id));
  };

  const visibleTodos = todos.filter(todo => {
    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  const activeCount = todos.filter(todo => !todo.completed).length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTitle={newTitle}
          setNewTitle={setNewTitle}
          onSubmit={handleSubmit}
          isAdding={!!tempTodo}
          todosCount={todos.length}
          activeCount={activeCount}
          inputRef={inputRef}
        />

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          loadingIds={loadingIds}
          onDelete={handleDelete}
        />

        {todos.length > 0 && (
          <Footer
            activeCount={activeCount}
            filter={filter}
            setFilter={setFilter}
            hasCompleted={todos.some(t => t.completed)}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        error={error}
        onClose={() => setError(ErrorMessage.NONE)}
      />
    </div>
  );
};
