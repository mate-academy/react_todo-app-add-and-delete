/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useContext } from 'react';
import cn from 'classnames';
import { Error } from './types/Error';
import { UserWarning } from './UserWarning';
import { Header } from './components/Header/Content/Header/Header';
import * as todoService from './service/todo';
import { Footer } from './components/Header/Content/Footer/Footer';
import { TodoList } from './components/Header/Content/Main/TodoList/TodoList';
import { TodosContext } from './Context/TodosContext';

const USER_ID = '/todos?userId=12151';

export const App: React.FC = () => {
  const {
    todos, handleApiTodos, handleErrorMessage, errorMessage,
  } = useContext(TodosContext);

  const handleCloseNotification = () => {
    handleErrorMessage(Error.None);
  };

  useEffect(() => {
    todoService.getTodos(USER_ID)
      .then(handleApiTodos)
      .catch(newError => {
        handleErrorMessage(Error.Load);
        throw newError;
      });
  }, []);

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => handleErrorMessage(Error.None), 3000);
    }
  }, [errorMessage, handleErrorMessage]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        <TodoList />

        {!!todos.length && (
          <Footer />
        )}

      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      {errorMessage && (
        <div
          data-cy="ErrorNotification"
          className="notification is-danger is-light has-text-weight-normal"
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className={cn('delete', {
              hidden: errorMessage,
            })}
            onClick={handleCloseNotification}
          />
          {/* show only one message at a time */}
          {errorMessage}
        </div>
      )}

    </div>
  );
};
