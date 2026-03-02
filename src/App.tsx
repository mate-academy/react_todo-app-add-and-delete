/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { client } from './utils/fetchClient';

import Header from './components/Header';
import TodoList from './components/TodoList';
import Footer from './components/Footer';
import ErrorNotification from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [loading, setLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [updatingIds, setUpdatingIds] = useState<number[]>([]);
  const [newTitle, setNewTitle] = useState('');

  const newTodoRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    setError('');
    setLoading(true);
    getTodos()
      .then(todosFromServer => {
        setTimeout(() => setTodos(todosFromServer), 150);
      })
      .catch(() => setError('Unable to load todos'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!loading) {
      newTodoRef.current?.focus();
    }
  }, [loading]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 3000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newTitle.trim();

    if (!trimmed) {
      setError('Title should not be empty');

      return;
    }

    const optimisticTodo: Todo = {
      id: 0,
      title: trimmed,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(optimisticTodo);
    setLoading(true);

    try {
      const addedTodo = await client.post<Todo>('/todos', {
        title: trimmed,
        userId: USER_ID,
        completed: false,
      });

      setTodos(prev => [...prev, addedTodo]);
      setTempTodo(null);
      setNewTitle('');
      newTodoRef.current?.focus();
    } catch {
      setError('Unable to add a todo');
      setTempTodo(null);
      newTodoRef.current?.focus();
    } finally {
      setLoading(false);
    }
  };

  const deleteTodo = async (id: number) => {
    setUpdatingIds(prev => [...prev, id]);
    try {
      await client.delete(`/todos/${id}`);
      setTodos(prev => prev.filter(t => t.id !== id));

      newTodoRef.current?.focus();
    } catch {
      setError('Unable to delete a todo');
    } finally {
      setUpdatingIds(prev => prev.filter(i => i !== id));
    }
  };

  const toggleTodo = (id: number) => {
    setUpdatingIds(prev => [...prev, id]);
    setTimeout(() => {
      setTodos(
        todos.map(todo =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo,
        ),
      );
      setUpdatingIds(prev => prev.filter(i => i !== id));
    }, 200);
  };

  const toggleAll = () => {
    const newCompleted = !todos.every(todo => todo.completed);
    const allIds = todos.map(todo => todo.id);

    setUpdatingIds(allIds);
    setTimeout(() => {
      setTodos(todos.map(todo => ({ ...todo, completed: newCompleted })));
      setUpdatingIds([]);
    }, 200);
  };

  const clearCompleted = async () => {
    const completedTodos = todos.filter(t => t.completed);

    if (completedTodos.length === 0) {
      return;
    }

    const ids = completedTodos.map(t => t.id);

    setUpdatingIds(ids);

    const successIds: number[] = [];
    let hasError = false;

    await Promise.allSettled(
      ids.map(async id => {
        try {
          await client.delete(`/todos/${id}`);
          successIds.push(id); // ✅ тільки успішні
        } catch {
          hasError = true;
        }
      }),
    );

    setTodos(prev => prev.filter(t => !successIds.includes(t.id))); // ✅ видаляємо тільки успішні
    setUpdatingIds([]);

    if (!hasError) {
      newTodoRef.current?.focus();
    } else {
      setError('Unable to delete a todo');
    }
  };

  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTitle={newTitle}
          setNewTitle={setNewTitle}
          onSubmit={handleSubmit}
          isLoading={loading}
          inputRef={newTodoRef}
          todosLength={todos.length}
          allCompleted={allCompleted}
          onToggleAll={toggleAll}
        />

        {(loading || todos.length > 0) && (
          <>
            <TodoList
              todos={todos}
              filter={filter}
              tempTodo={tempTodo}
              updatingIds={updatingIds}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              isLoading={loading}
            />

            <Footer
              activeCount={todos.filter(t => !t.completed).length}
              filter={filter}
              setFilter={setFilter}
              hasCompleted={todos.some(t => t.completed)}
              onClearCompleted={clearCompleted}
            />
          </>
        )}
      </div>

      <ErrorNotification error={error} onClose={() => setError('')} />
    </div>
  );
};
