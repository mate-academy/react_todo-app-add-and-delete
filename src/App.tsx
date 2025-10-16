import React from 'react';

import { TodoList } from './components/TodoList';
import { UserWarning } from './UserWarning';

const USER_ID = 0;

export const App: React.FC = () => {
  if (!USER_ID) {
    return <UserWarning />;
  }
  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <TodoList />
    </div>
  );
};
