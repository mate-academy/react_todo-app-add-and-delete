/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { UserWarning } from './UserWarning';
import { TodoTab } from './components/TodoTab';
import { useTodo } from './providers/TodoProvider';
import { Error } from './components/Error';

export const App: React.FC = () => {
  const { USER_ID } = useTodo();

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <TodoTab />
      <Error />
    </div>
  );
};
