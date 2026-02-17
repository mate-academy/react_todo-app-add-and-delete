/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { deleteTodos, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { TodoFilter } from './types/TodoFilter';
import { ERROR_MESSAGES, ErrorMessage } from './types/ErrorMessages';
import { Header } from './components/Header';
import { TodosList } from './components/TodosList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | null>(null);
  const [filterBy, setFilterBy] = useState<TodoFilter>('all');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingIds, setProcessingIds] = useState<number[]>([]);

  const activeTodosCounter = todos.filter(todo => !todo.completed).length;
  const inputRef = useRef<HTMLInputElement>(null);
  const focusInput = () => inputRef.current?.focus();
  const hasCompletedTodos = todos.some(todo => todo.completed);

  const filteredTodos = todos.filter(todo => {
    if (filterBy === 'active') {
      return !todo.completed;
    }

    if (filterBy === 'completed') {
      return todo.completed;
    }

    return true;
  });

  useEffect(() => {
    setErrorMessage(null);

    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ERROR_MESSAGES.LOAD_FAIL);
      });
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timerId = window.setTimeout(() => setErrorMessage(null), 3000);

    return () => window.clearTimeout(timerId);
  }, [errorMessage]);

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const completedIds = completedTodos.map(todo => todo.id);

    if (!completedTodos.length) {
      return;
    }

    setProcessingIds(prevState => [...prevState, ...completedIds]);

    Promise.allSettled(completedIds.map(id => deleteTodos(id)))
      .then(results => {
        const successIds = completedIds.filter(
          (_, index) => results[index].status === 'fulfilled',
        );
        const hasRejected = results.some(
          result => result.status === 'rejected',
        );

        if (hasRejected) {
          setErrorMessage(ERROR_MESSAGES.DELETE_FAIL);
        }

        setTodos(prevState =>
          prevState.filter(todo => !successIds.includes(todo.id)),
        );
      })
      .finally(() => {
        setProcessingIds(prevState =>
          prevState.filter(id => !completedIds.includes(id)),
        );
        focusInput();
      });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          onErrorMessage={setErrorMessage}
          onSetTempTodo={setTempTodo}
          onSetTodo={setTodos}
          setProcessingIds={setProcessingIds}
          inputRef={inputRef}
        />
        <TodosList
          todos={todos}
          filteredTodos={filteredTodos}
          tempTodo={tempTodo}
          setProcessingIds={setProcessingIds}
          processingIds={processingIds}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
          focusInput={focusInput}
        />
        <Footer
          todos={todos}
          activeTodosCounter={activeTodosCounter}
          filterBy={filterBy}
          onFilterChange={setFilterBy}
          hasCompletedTodos={hasCompletedTodos}
          handleClearCompleted={handleClearCompleted}
        />
      </div>
      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification
        errorMessage={errorMessage}
        onClearError={setErrorMessage}
      />{' '}
    </div>
  );
};
