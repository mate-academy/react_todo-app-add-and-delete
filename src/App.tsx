// App.tsx
import React, { useEffect, useMemo, useState } from 'react';
// eslint-disable-next-line max-len
import { UserWarning } from './UserWarning';
import { createTodo, getTodos, updateTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { client } from './utils/fetchClient';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoItem } from './components/TodoItem';
import { Errors } from './utils/enums/ErrorMessage';

const FILTERS = {
  all: 'all' as const,
  active: 'active' as const,
  completed: 'completed' as const,
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [titleToSet, setTitleToSet] = useState('');
  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const allCompleted = todos.length > 0 && todos.every(t => t.completed);
  const hasCompletedTodos = todos.some(t => t.completed);
  const [filter, setFilter] = useState<(typeof FILTERS)[keyof typeof FILTERS]>(
    FILTERS.all,
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<number[]>([]);
  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter(t => !t.completed);
      case 'completed':
        return todos.filter(t => t.completed);
      default:
        return todos;
    }
  }, [todos, filter]);
  const remainingCount = useMemo(
    () => todos.filter(t => !t.completed).length,
    [todos],
  );

  useEffect(() => {
    getTodos()
      .then(data => {
        if (!data) {
          throw new Error();
        }

        setTodos(data);
      })
      .catch(() => {
        setError(Errors.UTLT);
      });
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  const addTodo = async (title: string) => {
    const trimmed = title.trim();

    if (trimmed) {
      setError(null);

      setLoading(prev => [...prev, 0]);

      try {
        const newTempTodo: Todo = {
          id: 0,
          title: trimmed,
          userId: USER_ID,
          completed: false,
        };

        setTempTodo(newTempTodo);

        const created = await createTodo({
          title: trimmed,
          userId: USER_ID,
          completed: false,
        });

        setTodos(prev => [...prev, created]);
        setNewTitle('');
      } catch (err) {
        setError(Errors.UTAT);
      } finally {
        setLoading(prev => prev.filter(id => id !== 0));
        setTempTodo(null);
      }
    } else {
      setError(Errors.TSNE);
    }
  };

  const updateTodo = async (id: number, checked?: boolean, title?: string) => {
    setError(null);
    setLoading(prev => [...prev, id]);

    try {
      const payload = {
        id,
        ...(checked !== undefined ? { completed: checked } : {}),
        ...(title !== undefined ? { title } : {}),
      };

      if (checked !== undefined) {
        payload.completed = checked;
      }

      if (title !== undefined) {
        payload.title = title;
      }

      const updated = await updateTodos(payload);

      setTodos(prev => prev.map(t => (t.id === updated.id ? updated : t)));
      setSelectedTodoId(null);
      setTitleToSet('');
    } catch {
      setError(Errors.CNUT);
    } finally {
      setLoading(prev => prev.filter(lid => lid !== id));
    }
  };

  const deleteTodo = async (id: number) => {
    setLoading(prev => [...prev, id]);
    try {
      await client.delete(`/todos/${id}`);
      setTodos(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      setError(Errors.UTDT);
    } finally {
      setLoading(prev => prev.filter(lid => lid !== id));
    }
  };

  const deleteCompletedTodos = async () => {
    const ids = todos.filter(t => t.completed).map(t => t.id);

    if (ids.length > 0) {
      setError(null);
      setLoading(prev => [...prev, ...ids]);

      try {
        const results = await Promise.allSettled(
          ids.map(id => client.delete(`/todos/${id}`)),
        );

        const successfulIds = results
          .map((result, idx) => {
            if (result.status === 'fulfilled') {
              return ids[idx];
            }

            return null;
          })
          .filter((id): id is number => id !== null);

        setTodos(prev =>
          prev.filter(t => !(t.completed && successfulIds.includes(t.id))),
        );

        const hasRejected = results.some(r => r.status === 'rejected');

        if (hasRejected) {
          setError(Errors.UTDT);
        }
      } catch (err) {
        setError(Errors.UTDT);
      } finally {
        setLoading(prev => prev.filter(lid => !ids.includes(lid)));
      }
    }
  };

  const onToggleAll = async () => {
    if (todos.length > 0) {
      const shouldComplete = !allCompleted;

      setError(null);

      setLoading(prev => [...prev, ...todos.map(t => t.id)]);

      try {
        await Promise.all(todos.map(t => updateTodo(t.id, shouldComplete)));
      } catch {
        setError(Errors.CUST);
      } finally {
        setLoading(prev =>
          prev.filter(lid => !todos.map(t => t.id).includes(lid)),
        );
      }
    }
  };

  const handleToggle = (id: number, completed: boolean) => {
    updateTodo(id, completed);
  };

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
          onAdd={addTodo}
          onToggleAll={onToggleAll}
          allCompleted={allCompleted}
          error={error}
          loading={loading}
        />
        <TodoList
          todos={todos}
          filteredTodos={filteredTodos}
          selectedTodoId={selectedTodoId}
          setSelectedTodoId={setSelectedTodoId}
          titleToSet={titleToSet}
          setTitleToSet={setTitleToSet}
          loading={loading}
          onDelete={deleteTodo}
          onToggle={handleToggle}
          onUpdate={updateTodo}
        />

        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            todos={todos}
            selectedTodoId={selectedTodoId}
            setSelectedTodoId={setSelectedTodoId}
            titleToSet={titleToSet}
            setTitleToSet={setTitleToSet}
            loading={loading}
            onDelete={deleteTodo}
            onToggle={handleToggle}
            onUpdate={updateTodo}
            isProcessed={true}
          />
        )}

        {todos.length > 0 && (
          <Footer
            remainingCount={remainingCount}
            filter={filter}
            setFilter={setFilter}
            onClearCompleted={deleteCompletedTodos}
            hasCompletedTodos={hasCompletedTodos}
          />
        )}
      </div>
      <ErrorNotification error={error} onClose={() => setError(null)} />
    </div>
  );
};
