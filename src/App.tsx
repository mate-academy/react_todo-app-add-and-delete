import React, { useContext } from 'react';
import { ErrorNotification } from './components/ErrorNotification';
import { AppHeader } from './components/AppHeader';
import { AppFooter } from './components/AppFooter';
import { TodoList } from './components/TodoList';
import { StateContex } from './Store';

export const App: React.FC = () => {
  const { todos, error } = useContext(StateContex);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <AppHeader />

        <TodoList />

        {!!todos.length && <AppFooter />}
      </div>

      <ErrorNotification errorMessage={error} />
    </div>
  );
};
