/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext } from 'react';

import { UserWarning } from '../../UserWarning';

import { Header } from '../Header/Header';
import { TodosContext, USER_ID } from '../../TodosContext/TodosContext';
import { Main } from '../Main/Main';
import { Footer } from '../Footer/Footer';
import { Notification } from '../Notification/Notification';

export const TodoApp: React.FC = () => {
  const { todos } = useContext(TodosContext);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        <Main />

        {/* Hide the footer if there are no todos */}
        {!!todos.length && <Footer />}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <Notification />
    </div>
  );
};
