/* eslint-disable */
import React from 'react';
import { UserWarning } from './UserWarning';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { TodoList } from './components/TodoList/TodoList';
import { useAppContext } from './components/Context/AppContext';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const {
    userId,
    todos,
  } = useAppContext();

  if (!userId) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        {todos && (
          <section className="todoapp__main" data-cy="TodoList">
            <TodoList />
          </section>
        )}

        {todos && (
          <Footer />
        )}
      </div>

      <ErrorNotification />
    </div>
  );
};
