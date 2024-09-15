/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import './styles/index.scss';
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { deleteTodos, getTodos, USER_ID } from './api/todos';
import { Todo, TodoStatusFilter } from './types/Todo';
import { Header } from './components/Header';
import { TodoError } from './components/TodoError/TodoError';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedStatus, setSelectedStatus] = useState(TodoStatusFilter.All);
  const [error, setError] = useState<string | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setError('Unable to load todos'));
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);

      return () => clearTimeout(timer);
    }

    return;
  }, [error]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filteredStatus = useMemo(() => {
    switch (selectedStatus) {
      case TodoStatusFilter.Active:
        return todos.filter(todo => !todo.completed);
      case TodoStatusFilter.Completed:
        return todos.filter(todo => todo.completed);
      case TodoStatusFilter.All:

      default:
        return todos;
    }
  }, [todos, selectedStatus]);

  const handleErrorClose = () => {
    setError(null);
  };

  const handleSelectedStatus = (status: TodoStatusFilter) => {
    setSelectedStatus(status);
  };

  const hasTodos = todos.length > 0;
  const hasCompletedTodos = todos.some(todo => todo.completed);

  const handleDeleteTodo = (todoId: number) => {
    deleteTodos(todoId);
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          todos={todos}
          setTodos={setTodos}
          errorMessage={error}
          setError={setError}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setTempTodo={setTempTodo}
        />
        <TodoList
          todos={filteredStatus}
          onDeleteTodo={handleDeleteTodo}
          tempTodo={tempTodo}
        />
        {hasTodos && (
          <Footer
            todos={todos}
            hasCompletedTodos={hasCompletedTodos}
            selectedStatus={selectedStatus}
            handleSelectedStatus={handleSelectedStatus}
          />
        )}
      </div>
      <TodoError message={error} onCLose={handleErrorClose} />
    </div>
  );
};
