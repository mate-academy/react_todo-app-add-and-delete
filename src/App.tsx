/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { Loader } from './components/Loader';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { useLoading } from './hooks/useLoading';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, wrapWithLoading] = useLoading();
  const [error, setError] = useState<string | null>(null);
  const [filterByStatus, setFilterByStatus] = useState<
    'all' | 'active' | 'completed'
  >('all');
  const [code, setCode] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodos, setDeletingTodos] = useState<number[]>([]);
  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  useEffect(() => {
    wrapWithLoading(async () => {
      setShowNotification(false);
      try {
        const todos = await todoService.getTodos();

        setTodos(todos);
      } catch {
        setError('Unable to load todos');
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      }
    });
  }, []);

  const inputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isSubmitting && (error || code === '')) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [isSubmitting, error, code]);

  const handleCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCode(event.target.value);

    if (error === 'Title should not be empty' && showNotification) {
      setError(null);
      setShowNotification(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (code.trim() === '') {
      setError('Title should not be empty');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);

      return;
    }

    setError(null);
    setShowNotification(false);
    setIsSubmitting(true);

    const tempId = Date.now();
    const tempTodo = {
      id: tempId,
      userId: todoService.USER_ID,
      title: code.trim(),
      completed: false,
      isTemp: true,
    };

    setTempTodo(tempTodo);

    try {
      const createdTodo = await todoService.createTodo(code.trim());

      setTodos(prev => [...prev, createdTodo]);
      setTempTodo(null);
      setCode('');
    } catch {
      setTempTodo(null);
      setError('Unable to add a todo');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateTodo = async (todoId: number, title: string) => {
    if (title.trim() === '') {
      setError('Title should not be empty');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);

      return;
    }

    setError(null);
    setShowNotification(false);

    try {
      const updatedTodo = await todoService.updateTodo(todoId, {
        userId: todoService.USER_ID,
        title: title.trim(),
      });

      setTodos(prev =>
        prev.map(todo => (todo.id === todoId ? updatedTodo : todo)),
      );
      setError(null);
      setShowNotification(false);
    } catch {
      setError('Unable to update a todo');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    }
  };

  const clearTodos = async () => {
    setError(null);
    setShowNotification(false);

    const completedTodos = todos.filter(todo => todo.completed);
    const successfullyDeleted: number[] = [];
    let hasErrors = false;

    for (const todo of completedTodos) {
      try {
        await todoService.deleteTodo(todo.id);
        successfullyDeleted.push(todo.id);
      } catch {
        hasErrors = true;
      }
    }

    if (successfullyDeleted.length > 0) {
      setTodos(prev =>
        prev.filter(todo => !successfullyDeleted.includes(todo.id)),
      );
    }

    if (hasErrors) {
      setError('Unable to delete a todo');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } else {
      setError(null);
      setShowNotification(false);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  function filteredTodos() {
    let baseTodos = todos;

    if (filterByStatus === 'active') {
      baseTodos = todos.filter(todo => !todo.completed);
    } else if (filterByStatus === 'completed') {
      baseTodos = todos.filter(todo => todo.completed);
    }

    if (tempTodo) {
      const shouldShowTemp =
        filterByStatus === 'all' ||
        (filterByStatus === 'active' && !tempTodo.completed) ||
        (filterByStatus === 'completed' && tempTodo.completed);

      if (shouldShowTemp) {
        return [...baseTodos, tempTodo];
      }
    }

    return baseTodos;
  }

  function closeNotification() {
    setShowNotification(false);
    setError(null);
  }

  const deleteTodo = async (todoId: number) => {
    setError(null);
    setShowNotification(false);

    setDeletingTodos(prev => [...prev, todoId]);

    try {
      await todoService.deleteTodo(todoId);
      setTodos(prev => prev.filter(todo => todo.id !== todoId));

      setTimeout(() => inputRef.current?.focus(), 0);
    } catch {
      setError('Unable to delete a todo');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);

      setTimeout(() => inputRef.current?.focus(), 0);
    } finally {
      setDeletingTodos(prev => prev.filter(id => id !== todoId));
    }
  };

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  const toggleTodo = async (todoId: number) => {
    const todo = todos.find(t => t.id === todoId);

    if (!todo) {
      return;
    }

    setError(null);
    setShowNotification(false);

    try {
      const updatedTodo = await todoService.toggleTodo(todoId, !todo.completed);

      setTodos(prev => prev.map(t => (t.id === todoId ? updatedTodo : t)));
      setError(null);
      setShowNotification(false);
    } catch {
      setError('Failed to toggle todo. Please try again.');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    }
  };

  const toggleAllTodos = async () => {
    const allCompleted = todos.every(todo => todo.completed);
    const shouldComplete = !allCompleted;

    setError(null);
    setShowNotification(false);

    try {
      await todoService.toggleAllTodos(todos, shouldComplete);
      setTodos(prev =>
        prev.map(todo => ({ ...todo, completed: shouldComplete })),
      );
      setError(null);
      setShowNotification(false);
    } catch {
      setError('Failed to toggle all todos. Please try again.');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      {loading && <Loader />}

      {!loading && (
        <div className="todoapp__content">
          <Header
            code={code}
            handleCodeChange={handleCodeChange}
            handleSubmit={handleSubmit}
            todos={todos}
            activeTodosCount={activeTodosCount}
            toggleAllTodos={toggleAllTodos}
            isSubmitting={isSubmitting}
            inputRef={inputRef}
          />

          <TodoList
            todos={filteredTodos()}
            filterByStatus={filterByStatus}
            toggleTodo={toggleTodo}
            deleteTodo={deleteTodo}
            updateTodo={updateTodo}
            tempTodo={tempTodo ? tempTodo.id : null}
            deletingTodos={deletingTodos}
          />

          {todos.length > 0 && (
            <Footer
              activeTodosCount={activeTodosCount}
              filterByStatus={filterByStatus}
              setFilterByStatus={setFilterByStatus}
              clearTodos={clearTodos}
              completedTodosCount={todos.length - activeTodosCount}
            />
          )}
        </div>
      )}

      <ErrorNotification
        message={error}
        isVisible={showNotification}
        onClose={closeNotification}
      />
    </div>
  );
};
