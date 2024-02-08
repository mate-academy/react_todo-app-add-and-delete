/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { UserWarning } from './components/UserWarming';
import { AppTodo } from './components/AppTodo';
import { USER_ID } from './utils/constant';

export const App: React.FC = () => {
  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <AppTodo />
  );
};
