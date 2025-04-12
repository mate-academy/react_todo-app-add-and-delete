/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { getTodos } from './api/todos';
import { Todo } from './types/Todo';

import Header from './components/Header';
import Footer from './components/Footer';
import ErrorNotification from './components/ErrorNotification';
import TodoList from './components/TodoList';

export enum Filter {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedNav, setSelectedNav] = useState(Filter.All);
  const [activeTodoIds, setActiveTodoIds] = useState<number[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadTodos = async () => {
    setError('');
    try {
      const res = await getTodos();

      setTodos(res);
    } catch (err) {
      setError('Unable to load todos');
    } finally {
      inputRef.current?.focus();
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 3000);

      return () => clearTimeout(timer);
    }

    return;
  }, [error]);

  useEffect(() => {
    if (tempTodo) {
      setActiveTodoIds(current => [...current, tempTodo.id]);

      if (tempTodo.id > 0) {
        setTodos(current => [...current, tempTodo]);
        setTempTodo(null);
        setActiveTodoIds(current => current.filter(id => id !== tempTodo.id));
      }
    }
  }, [tempTodo]);

  const filteredTodos = todos.filter(todo => {
    switch (selectedNav) {
      case Filter.Active:
        return !todo.completed;
      case Filter.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  const handleFilter = (e: React.MouseEvent) => {
    const filter =
      e.currentTarget.getAttribute('href')?.replace('#', '') || Filter.All;

    setSelectedNav(filter as Filter);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          inputRef={inputRef}
          setTempTodo={setTempTodo}
          setError={setError}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
        <TodoList
          filteredTodos={filteredTodos}
          activeTodoIds={activeTodoIds}
          setActiveTodoIds={setActiveTodoIds}
          setTodos={setTodos}
          tempTodo={tempTodo}
          setError={setError}
          inputRef={inputRef}
        />
        {todos.length > 0 && (
          <Footer
            todos={todos}
            selectedNav={selectedNav}
            handelFilter={handleFilter}
            setError={setError}
            inputRef={inputRef}
            setTodos={setTodos}
            isLoading={isLoading}
            setActiveTodoIds={setActiveTodoIds}
          />
        )}
      </div>
      <ErrorNotification error={error} setError={setError} />
    </div>
  );
};
