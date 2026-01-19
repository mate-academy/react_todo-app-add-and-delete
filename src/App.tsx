import React from 'react';

import { UserWarning } from './components/UserWarning';
import { UserTodos } from './components/UserTodos';

import { USER_ID } from './api/todos';

export const App: React.FC = () => {
  return USER_ID ? <UserTodos userId={USER_ID} /> : <UserWarning />;
};
