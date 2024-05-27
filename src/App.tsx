/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
// import React, { useEffect } from 'react';
import { TodoApp } from './TodoApp';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { TodosProvider } from './components/todosContext';

export const App: React.FC = () => {
  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <TodosProvider>
      <TodoApp />
    </TodosProvider>
  );
};
