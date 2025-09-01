/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { client } from './utils/fetchClient';
import { Header } from './Header';
import { TodoItem } from './TodoItem';
import { Footer } from './Footer';
import { ErrorNotification } from './ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);
  const [shouldFocusInput, setShouldFocusInput] = useState(0);

  const loadTodos = async () => {
    setLoading(true);
    setError(null);
    try {
      const todosFromServer = await client.get<Todo[]>(
        `/todos?userId=${USER_ID}`,
      );

      setTodos(todosFromServer);
    } catch {
      setError('Unable to load todos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const addTodo = async (title: string): Promise<boolean> => {
    setIsAdding(true);
    const newTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempTodo(newTodo);
    try {
      const response = await client.post<Todo>('/todos', {
        title,
        userId: USER_ID,
        completed: false,
      });

      setTodos(prev => [...prev, response]);

      return true;
    } catch {
      setError('Unable to add a todo');

      return false;
    } finally {
      setTempTodo(null);
      setIsAdding(false);
    }
  };

  const toggleAll = () => {
    const shouldCompleteAll = todos.some(t => !t.completed);

    setTodos(prev => prev.map(t => ({ ...t, completed: shouldCompleteAll })));
  };

  const toggleOne = (id: number) => {
    setTodos(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  };

  const deleteOne = async (id: number) => {
    setDeletingIds(prev => [...prev, id]);
    try {
      await client.delete(`/todos/${id}`);
      setTodos(prev => prev.filter(t => t.id !== id));
    } catch {
      setError('Unable to delete a todo');
    } finally {
      setDeletingIds(prev => prev.filter(deletingId => deletingId !== id));
      setShouldFocusInput(prev => prev + 1);
    }
  };

  const clearCompleted = async () => {
    const completedTodos = todos.filter(t => t.completed);

    if (completedTodos.length === 0) {
      return;
    }

    setDeletingIds(completedTodos.map(todo => todo.id));

    const results = await Promise.allSettled(
      completedTodos.map(todo => client.delete(`/todos/${todo.id}`)),
    );

    const failed = results.some(r => r.status === 'rejected');
    const succeededIds = completedTodos
      .filter((_, i) => results[i].status === 'fulfilled')
      .map(todo => todo.id);

    setTodos(prev => prev.filter(t => !succeededIds.includes(t.id)));

    if (failed) {
      setError('Unable to delete a todo');
    }

    setDeletingIds([]);
    setShouldFocusInput(prev => prev + 1);
  };

  const hideError = () => setError(null);

  const getFilterTodos = () => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

  const activeTodosCount = todos.filter(t => !t.completed).length;
  const completedCount = todos.length - activeTodosCount;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          todos={todos}
          onAddTodo={addTodo}
          onToggleAll={toggleAll}
          disabled={isAdding}
          onError={setError}
          shouldFocusInput={shouldFocusInput}
        />
        {loading && <div className="loader" />}
        {todos.length > 0 && (
          <section className="todoapp__main" data-cy="TodoList">
            {getFilterTodos().map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleOne}
                onDelete={deleteOne}
                isDeleting={deletingIds.includes(todo.id)}
              />
            ))}
          </section>
        )}
        {tempTodo && (
          <TodoItem
            key={tempTodo.id}
            todo={tempTodo}
            onToggle={() => {}}
            onDelete={() => {}}
          />
        )}
        {todos.length > 0 && (
          <Footer
            activeCount={activeTodosCount}
            completedCount={completedCount}
            filter={filter}
            onFilterChange={setFilter}
            onClearCompleted={clearCompleted}
          />
        )}
      </div>
      <ErrorNotification message={error} onClose={hideError} />
    </div>
  );
};
