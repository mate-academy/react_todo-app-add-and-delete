import React from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { TodoApp } from './components/TodoApp';
import { ErrorContextProvider } from './context/Error.context';
import { TodoContextProvider } from './context/Todo.context';

export const App: React.FC = () => {
  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <TodoContextProvider>
      <ErrorContextProvider>
        <TodoApp />
      </ErrorContextProvider>
    </TodoContextProvider>
  );
};
