/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { TodoProvider } from './context/TodoContext';
import { Container } from './components/Container/Container';
import { Error } from './components/Error';

export const App: React.FC = () => {
  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <TodoProvider>
        <Container />
        <Error />
      </TodoProvider>
    </div>
  );
};
