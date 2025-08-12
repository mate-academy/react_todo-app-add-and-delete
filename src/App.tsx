import React, { useEffect, useState, useRef } from 'react';
import { getTodos, USER_ID, createTodo, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';

import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoItem } from './components/TodoItem';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const loadTodos = async () => {
    setIsLoading(true);
    setError('');

    try {
      const loadedTodos = await getTodos();

      setTodos(loadedTodos);
    } catch {
      setError('Unable to load todos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTodo = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError('Title should not be empty');
      inputRef.current?.focus();

      return;
    }

    const newTodo = {
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo({
      id: 0,
      ...newTodo,
      isLoading: true,
    });

    try {
      setIsLoading(true);
      const createdTodo = await createTodo(newTodo);

      setTodos(prev => [
        ...prev,
        {
          ...createdTodo,
          isLoading: false,
        },
      ]);
      setTitle('');
    } catch {
      setError('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      setTodos(prev =>
        prev.map(todo =>
          todo.id === id ? { ...todo, isLoading: true } : todo,
        ),
      );

      await deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch {
      setError('Unable to delete a todo');
      setTodos(prev =>
        prev.map(todo =>
          todo.id === id ? { ...todo, isLoading: false } : todo,
        ),
      );
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    try {
      setTodos(prev =>
        prev.map(todo =>
          todo.completed ? { ...todo, isLoading: true } : todo,
        ),
      );

      const results = await Promise.allSettled(
        completedTodos.map(todo =>
          deleteTodo(todo.id)
            .then(() => ({ success: true, id: todo.id }))
            .catch(() => ({ success: false, id: todo.id })),
        ),
      );

      const hasErrors = results.some(result => !result.value.success);

      if (hasErrors) {
        setError('Unable to delete a todo');
      }

      setTodos(prev =>
        prev.filter(todo => {
          const result = results.find(r => r.value.id === todo.id);

          return !todo.completed || (result && !result.value.success);
        }),
      );
    } catch {
      setError('Unable to delete completed todos');
    } finally {
      setTodos(prev => prev.map(todo => ({ ...todo, isLoading: false })));
      inputRef.current?.focus();
    }
  };

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    loadTodos();
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos, tempTodo]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 3000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  const incompleteCount = todos.filter(todo => !todo.completed).length;
  const hasCompleted = todos.some(todo => todo.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          title={title}
          setTitle={setTitle}
          onSubmit={handleAddTodo}
          isLoading={isLoading}
          inputRef={inputRef}
        />

        {!!todos.length && (
          <>
            <TodoList todos={filteredTodos} onDelete={handleDeleteTodo} />

            <Footer
              todos={todos}
              setFilter={setFilter}
              filter={filter}
              incompleteCount={incompleteCount}
              onClearCompleted={handleClearCompleted}
              hasCompleted={hasCompleted}
            />
          </>
        )}
      </div>

      {tempTodo && (
        <div data-cy="TodoItem" style={{ position: 'relative' }}>
          <TodoItem todo={tempTodo} onDelete={() => {}} />
        </div>
      )}

      <ErrorNotification message={error} onClose={() => setError('')} />
    </div>
  );
};
