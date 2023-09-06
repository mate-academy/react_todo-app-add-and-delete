/* eslint-disable import/no-cycle */
import React from 'react';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { TodosProvider } from './components/TodosContext';
import { TodoError } from './components/TodosError';

import { UserWarning } from './UserWarning';

export const USER_ID = 11376;

export const App: React.FC = () => {
  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <TodosProvider>
      <div className="todoapp">
        <h1 className="todoapp__title">todos</h1>

        <div className="todoapp__content">
          <Header />

          <TodoList />

          <Footer />
        </div>

        <TodoError />
      </div>
    </TodosProvider>
  );
};
