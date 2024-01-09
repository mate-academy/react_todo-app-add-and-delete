/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect } from 'react';
import { UserWarning } from './UserWarning';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { ErrorNotification } from './components/ErrorNotification';
import { useTodos } from './context/TodoProvider';
import { Footer } from './components/Footer';
import { getTodos } from './api/todos';
import { Errors } from './types';
import { USER_ID } from './utils/userId';

export const App: React.FC = () => {
  const {
    todos,
    setTodos,
    setErrorMessage,
  } = useTodos();

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setErrorMessage(Errors.UnableLoad));
  }, [setErrorMessage, setTodos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        <TodoList />

        {/* Hide the footer if there are no todos */}
        {!!todos.length && (
          <Footer />
        )}
      </div>

      <ErrorNotification />
    </div>
  );
};
