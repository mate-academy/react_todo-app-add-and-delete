/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';

import { USER_ID, getTodos, createTodo, deleteTodo } from './api';

import { Todo, FilterType, ErrorType } from './types';

import { UserWarning } from './UserWarning';

import { Error, Header, TodoList, Footer } from './components';

const getFilteredTodos = (todos: Todo[], filter: FilterType): Todo[] => {
  const visibleTodos = [...todos];

  switch (filter) {
    case FilterType.ACTIVE:
      return visibleTodos.filter(todo => !todo.completed);
    case FilterType.COMPLETED:
      return visibleTodos.filter(todo => todo.completed);
    default:
      return visibleTodos;
  }
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterStatus, setFilterStatus] = useState(FilterType.ALL);
  const [error, setError] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shouldFocusInput, setShouldFocusInput] = useState(false);

  const filteredTodos = getFilteredTodos(todos, filterStatus);

  const handleCreateTodo = ({ title, userId, completed }: Omit<Todo, 'id'>) => {
    setError('');
    setIsSubmitting(true);

    setTempTodo({
      id: 0,
      title: title.trim(),
      userId: USER_ID,
      completed: false,
    });

    setIsLoading(prev => [...prev, 0]);

    return createTodo({ title, userId, completed })
      .then(newTodo => {
        setTodos(prevTodos => [...prevTodos, newTodo]);
        setTempTodo(null);
      })
      .catch(e => {
        setError(ErrorType.ADD);
        setTimeout(() => setError(''), 3000);
        throw e;
      })
      .finally(() => {
        setIsLoading(prev => prev.filter(id => id !== 0));
        setTempTodo(null);
        setIsSubmitting(false);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setIsLoading(prev => [...prev, todoId]);

    return deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(t => t.id !== todoId));
        setShouldFocusInput(true);
      })
      .catch(e => {
        setError(ErrorType.DELETE);
        setTimeout(() => setError(''), 3000);
        throw e;
      })
      .finally(() => {
        setIsLoading([]);
      });
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(e => {
        setError(ErrorType.LOAD);
        setTimeout(() => setError(''), 3000);
        throw e;
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setError={setError}
          onCreate={handleCreateTodo}
          isSubmitting={isSubmitting}
          shouldFocusInput={shouldFocusInput}
          setShouldFocusInput={setShouldFocusInput}
        />
        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          isLoading={isLoading}
          isSubmitting={isSubmitting}
          onDelete={handleDeleteTodo}
        />
        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            todos={todos}
            filterType={filterStatus}
            onChangeType={setFilterStatus}
            onDelete={handleDeleteTodo}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <Error error={error} setError={setError} />
    </div>
  );
};
