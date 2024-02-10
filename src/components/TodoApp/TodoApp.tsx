/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useEffect } from 'react';
import { UserWarning } from '../../UserWarning';
import { Header } from '../Header/Header';
import { Footer } from '../Footer/Footer';
import { ErrorMessages } from '../ErrorMessages/ErrorMessages';
import { TodoList } from '../TodoList/TodoList';
import { getTodos } from '../../api/todos';
import { TodosContext } from '../TodosContext';
import { ErrorMessage } from '../../types/ErrorMessage';

const USER_ID = 119;

export const TodoApp: React.FC = () => {
  const { todos, setTodos, setErrorMessage } = useContext(TodosContext);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorMessage.loading));
  }, [setTodos, setErrorMessage]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        {!!todos.length && <TodoList />}

        {/* Hide the footer if there are no todos */}

        {!!todos.length && <Footer />}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}

      <ErrorMessages />
    </div>
  );
};
