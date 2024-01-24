/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useContext } from 'react';
import { Error } from './types/Error';
import { UserWarning } from './UserWarning';
import { Header } from './components/Header/Content/Header/Header';
import * as todoService from './service/todo';
import { Footer } from './components/Header/Content/Footer/Footer';
import { TodoList } from './components/Header/Content/Main/TodoList/TodoList';
import { TodosContext } from './Context/TodosContext';
import { Notifications } from './components/Notifications/Notifications';

const USER_ID = '/todos?userId=12151';

export const App: React.FC = () => {
  const {
    todos, setTodos, handleErrorMessage, errorMessage,
  } = useContext(TodosContext);

  useEffect(() => {
    todoService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        handleErrorMessage(Error.Load);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

      {errorMessage && <Notifications />}

    </div>
  );
};
