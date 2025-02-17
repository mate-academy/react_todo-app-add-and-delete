/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { UserWarning } from './UserWarning';
import { TodoProvider } from './Components/TodoContext';
import { Header } from './Components/Header';
import { TodoList } from './Components/TodoList';
import { Footer } from './Components/Footer';
import { ErrorsNotify } from './Components/ErrorsNotify';

const USER_ID = 501;

export const App: React.FC = () => {
  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <TodoProvider>
        <div className="todoapp">
          <h1 className="todoapp__title">todos</h1>

          <div className="todoapp__content">
            <Header />
            <TodoList />
            <Footer />
          </div>
          <ErrorsNotify />
        </div>
      </TodoProvider>
    </div>
  );
};
