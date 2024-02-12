import React from 'react';

import { TodoApp } from './components/TodoApp/TodoApp';
import { UserWarning } from './UserWarning';
import { USER_ID } from './utils/constants';

export const App: React.FC = () => {
  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <TodoApp />
  );
};
