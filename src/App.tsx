import React, { useEffect, useRef, useState } from 'react';

import { UserWarning } from './UserWarning';
import { USER_ID, addTodo, deleteTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';

import { Footer } from './Components/Footer';
import { ErrorNotification } from './Components/ErrorNotification';
import { Header } from './Components/Header';
import { TodoList } from './Components/TodoList';
import { TodoItem } from './Components/TodoItem';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!tempTodo) {
      inputRef.current?.focus();
    }
  }, [tempTodo]);

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(''), 3000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = todos.filter(todo => {
    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  const handleAddTodo = (title: string, onSuccess: () => void) => {
    if (!title.trim()) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setIsAdding(true);
    setErrorMessage('');

    const newTempTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    setTempTodo(newTempTodo);

    addTodo(title)
      .then(createdTodo => {
        setTodos(prev => [...prev, createdTodo]);
        setTempTodo(null);
        //inputRef.current?.focus();
        onSuccess();
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        setTempTodo(null);
      })
      .finally(() => {
        setIsAdding(false);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setDeletingIds(prev => [...prev, todoId]);
    setErrorMessage('');

    deleteTodo(todoId)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== todoId));
        inputRef.current?.focus();
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setDeletingIds(prev => prev.filter(id => id !== todoId));
      });
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => handleDeleteTodo(todo.id));
  };

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodosExist = todos.some(todo => todo.completed);
  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          allCompleted={allCompleted}
          onAdd={handleAddTodo}
          isAdding={isAdding}
          inputRef={inputRef}
        />

        {todos.length > 0 && (
          <TodoList
            todos={visibleTodos}
            isLoading={isLoading}
            deletingIds={deletingIds}
            onDelete={handleDeleteTodo}
          />
        )}
        {tempTodo && (
          <TodoItem todo={tempTodo} isLoading={true} onDelete={() => {}} />
        )}

        {todos.length > 0 && (
          <Footer
            activeCount={activeTodosCount}
            filter={filter}
            setFilter={setFilter}
            hasCompleted={completedTodosExist}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        message={errorMessage}
        onClose={() => setErrorMessage('')}
      />
    </div>
  );
};
