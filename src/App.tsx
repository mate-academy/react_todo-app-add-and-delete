/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { UserWarning } from './UserWarning';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Error } from './components/Error';
import { TodoProvider } from './context/TodoContext';

const USER_ID = 11526;

export const App: React.FC = () => {
  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <TodoProvider>
        <div className="todoapp__content">
          <Header />
          <TodoList />
          <Footer />
        </div>
        <Error />
      </TodoProvider>
    </div>
  );
};
