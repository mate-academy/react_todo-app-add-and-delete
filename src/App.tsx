/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';

import { USER_ID } from './api/todos';
import { client } from './utils/fetchClient';

import { Todo } from './types/Todo';

import { Footer } from './components/footer';
import { ErrorNotification } from './components/ErrorNotification';
import { Header } from './components/Header';
import { TodoApp } from './components/TodoApp/TodoApp';
import { Loader } from './components/Loader';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[] | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const ErrorMessages = {
    None: '',
    Load: 'Unable to load todos',
    Empty: 'Title should not be empty',
    Add: 'Unable to add a todo',
    Delete: 'Unable to delete a todo',
  };

  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState(ErrorMessages.None);

  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  const [isAdding, setIsAdding] = useState(false);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const getTodos = () => {
    setIsLoading(true);
    setIsError(false);
    client
      .get(`/todos?userId=${USER_ID}`)
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessages.Load);
        setIsError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  //eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    getTodos();
  }, []);

  const onCreate = () => {
    getTodos();
    setTempTodo(null);
  };

  //eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (isError) {
      const timer = setTimeout(() => setIsError(false), 3000);

      return () => clearTimeout(timer);
    }
  }, [isError]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          setTodos={setTodos}
          setTempTodo={setTempTodo}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          isAdding={isAdding}
          setIsAdding={setIsAdding}
          setIsError={setIsError}
          setErrorMessage={setErrorMessage}
          USER_ID={USER_ID}
          onCreate={onCreate}
          ErrorMessages={ErrorMessages}
        />

        {todos && todos.length > 0 && (
          <TodoApp
            todos={todos}
            setTodos={setTodos}
            tempTodo={tempTodo}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            isAdding={isAdding}
            setIsAdding={setIsAdding}
            statusFilter={statusFilter}
            isError={isError}
            setIsError={setIsError}
            USER_ID={USER_ID}
            ErrorMessages={ErrorMessages}
            setErrorMessage={setErrorMessage}
          />
        )}
        {/* Hide the footer if there are no todos */}
        {todos && todos.length > 0 && (
          <Footer
            todos={todos}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
        )}
        <Loader isLoading={isLoading} />
      </div>
      <ErrorNotification
        isError={isError}
        setIsError={setIsError}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
