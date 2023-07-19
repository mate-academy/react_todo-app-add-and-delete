import React from 'react';

import { UserWarning } from './UserWarning';
import { TodoApp } from './components/TodoApp/TodoApp';

const USER_ID = 11079;

export const App: React.FC = () => {
  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <TodoApp
      userId={USER_ID}
    />
  );
};
