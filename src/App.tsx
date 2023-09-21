/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { UserWarning } from './UserWarning';
import { TodoApp } from './components/TodoApp/TodoApp';
import {
  TodosContextProvider,
} from './components/TodosContextProvider/TodosContextProvider';
import { USER_ID } from './utils/UserId';
import {
  ErrorContextProvider,
} from './components/ErrorContextProvider/ErrorContextProvider';

export const App: React.FC = () => {
  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <TodosContextProvider>
      <ErrorContextProvider>
        <TodoApp />
      </ErrorContextProvider>
    </TodosContextProvider>
  );
};
