/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React, { useEffect, useMemo, useRef } from 'react';

import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { getTodos, addTodo, deleteTodo } from './api/todos';

import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { Filter } from './types/Filter';

enum ErrorMessage {
  Load = 'Unable to load todos',
  Add = 'Unable to add a todo',
  Delete = 'Unable to delete a todo',
  EmptyTitle = 'Title should not be empty',
}

export const App: React.FC = () => {
  const [todos, setTodos] = React.useState<Todo[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [newTitle, setNewTitle] = React.useState('');
  const [tempTodo, setTempTodo] = React.useState<Todo | null>(null);
  const [isAdding, setIsAdding] = React.useState(false);
  const [deleteIds, setDeleteIds] = React.useState<number[]>([]);
  const [filter, setFilter] = React.useState<Filter>(Filter.All);

  const inputRef = useRef<HTMLInputElement>(null);

  const loadTodos = async () => {
    try {
      const data = await getTodos();

      setTodos(data);
    } catch {
      setTodos([]);
      setError(ErrorMessage.Load);
    }
  };

  useEffect(() => {
    setTimeout(loadTodos, 0);
  }, []);

  useEffect(() => {
    if (!error) {
      return;
    }

    const timer = setTimeout(() => setError(null), 3000);

    return () => clearTimeout(timer);
  }, [error]);

  useEffect(() => {
    inputRef.current?.focus();
  });

  const activeCount = todos.filter(t => !t.completed).length;
  const hasCompleted = todos.some(t => t.completed);
  const allCompleted = todos.length > 0 && activeCount === 0;

  const visibleTodos = useMemo(() => {
    switch (filter) {
      case Filter.Active:
        return todos.filter(t => !t.completed);
      case Filter.Completed:
        return todos.filter(t => t.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = newTitle.trim();

    if (!trimmed) {
      setError(ErrorMessage.EmptyTitle);

      return;
    }

    const temp: Todo = {
      id: 0,
      title: trimmed,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(temp);
    setIsAdding(true);

    try {
      const created = await addTodo({
        title: trimmed,
        completed: false,
        userId: USER_ID,
      });

      setTodos(prev => [...prev, created]);
      setNewTitle('');
    } catch {
      setError(ErrorMessage.Add);
    } finally {
      setTempTodo(null);
      setIsAdding(false);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    setDeleteIds(prev => [...prev, id]);

    try {
      await deleteTodo(id);
      setTodos(prev => prev.filter(t => t.id !== id));
    } catch {
      setError(ErrorMessage.Delete);
    } finally {
      setDeleteIds(prev => prev.filter(x => x !== id));
    }
  };

  const handleClearCompleted = async () => {
    const completed = todos.filter(t => t.completed);

    const results = await Promise.allSettled(
      completed.map(t => deleteTodo(t.id)),
    );

    const okIds: number[] = [];

    results.forEach((r, i) => {
      if (r.status === 'fulfilled') {
        okIds.push(completed[i].id);
      }
    });

    setTodos(prev => prev.filter(t => !okIds.includes(t.id)));

    if (results.some(r => r.status === 'rejected')) {
      setError(ErrorMessage.Delete);
    }
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
          onSubmit={handleAddTodo}
          isAdding={isAdding}
          inputRef={inputRef}
          allCompleted={allCompleted}
          hasTodos={todos.length > 0}
        />

        <TodoList
          todos={visibleTodos}
          deleteIds={deleteIds}
          onDelete={handleDeleteTodo}
          tempTodo={tempTodo}
          isAdding={isAdding}
        />

        {todos.length > 0 && (
          <Footer
            activeCount={activeCount}
            filter={filter}
            setFilter={setFilter}
            hasCompleted={hasCompleted}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification error={error} onClose={() => setError(null)} />
    </div>
  );
};
