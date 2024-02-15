/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext } from 'react';

import { USER_ID } from './utils/userId';

import { UserWarning } from './UserWarning';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { TodoContext } from './components/State/TodoContext';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const { todos } = useContext(TodoContext);

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
          <>
            <Footer />
          </>
        )}
      </div>

      <ErrorNotification />
    </div>
  );
};
