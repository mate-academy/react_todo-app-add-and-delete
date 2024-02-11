import React, { useContext } from 'react';
import { UserWarning } from './UserWarning';

import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { StateContext } from './management/TodoContext';

import { USER_ID } from './api/todos';
import { TodoList } from './components/TodoList';

export const App: React.FC = () => {
  const { todos } = useContext(StateContext);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />
        <TodoList />
        {todos.length > 0 && <Footer />}
      </div>

      <ErrorNotification />
    </div>
  );
};
