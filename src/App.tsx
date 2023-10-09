/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorsNotifications';
import { TodoList } from './components/TodoList';
import { TodosProvider } from './TodosContext/TodosContext';

export const App: React.FC = () => {
  return (
    <TodosProvider>
      <div className="todoapp">
        <h1 className="todoapp__title">todos</h1>

        <div className="todoapp__content">
          <Header />
          <TodoList />
          <Footer />
        </div>
        <ErrorNotification />
      </div>
    </TodosProvider>
  );
};
