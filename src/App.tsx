/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext } from 'react';
import { UserWarning } from './UserWarning';

import { USER_ID } from './api/todos';

import { StateContext } from './managment/TodoContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Error } from './components/Error';
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
        {!!todos.length && <Footer />}
      </div>

      <Error />
    </div>
  );
};
