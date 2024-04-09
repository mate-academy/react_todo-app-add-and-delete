/* eslint-disable max-len */
import React from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { Header } from './components/Header';
import { Main } from './components/Main';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { TodosProvider } from './components/TodosContext';

export const App: React.FC = () => {
  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <TodosProvider>
        <div className="todoapp__content">
          <Header />

          <Main />

          <Footer />
        </div>

        <ErrorNotification />
      </TodosProvider>
    </div>
  );
};
