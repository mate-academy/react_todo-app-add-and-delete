/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  getTodos,
  addTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { NewTodo } from './components/NewTodo';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (USER_ID) {
      getTodos(USER_ID)
        .then(setTodos)
        .catch(() => setErrorMessage('Unable to load todos'));
    }
  }, []);

  const handleAddTodo = async (title: string) => {
    if (!title.trim()) {
      setErrorMessage('Title should not be empty');

      return;
    }

    const newTodo = {
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    setTempTodo({ ...newTodo, id: -Math.random() });

    try {
      const createdTodo = await addTodo(newTodo);

      setTodos(prev => [...prev, createdTodo]);
    } catch {
      setErrorMessage('Unable to add a todo');
    } finally {
      setTempTodo(null);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    setLoadingIds(prev => [...prev, id]);
    try {
      await deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setLoadingIds(prev => prev.filter(loadingId => loadingId !== id));
    }
  };

  const handleUpdateTodo = async (updatedTodo: Todo) => {
    setLoadingIds(prev => [...prev, updatedTodo.id]);
    try {
      const todo = await updateTodo(updatedTodo);

      setTodos(prev => prev.map(t => (t.id === updatedTodo.id ? todo : t)));
    } catch {
      setErrorMessage('Unable to update a todo');
    } finally {
      setLoadingIds(prev => prev.filter(id => id !== updatedTodo.id));
    }
  };

  const handleClearCompleted = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        handleDeleteTodo(todo.id);
      }
    });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = todos.filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <NewTodo onAdd={handleAddTodo} />

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          loadingIds={loadingIds}
          onDelete={handleDeleteTodo}
          onUpdate={handleUpdateTodo}
        />

        {todos.length > 0 && (
          <Footer
            todos={todos}
            filter={filter}
            onFilterChange={setFilter}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onClose={() => setErrorMessage('')}
      />
    </div>
  );
};
