/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { TodoApp } from './components/TodoApp';
import { TodoContextProvider } from './contexts/TodoContext';
import { FilterContextProvider } from './contexts/FilterContext';

export const App: React.FC = () => {
  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <TodoContextProvider>
      <FilterContextProvider>
        <TodoApp />
      </FilterContextProvider>
    </TodoContextProvider>
  );
};
