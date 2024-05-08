/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { TodoApp } from './components/TodoApp';
import { TodosContextProvider } from './contexts/TodosContext';
import { ErrorMessageContextProvider } from './contexts/ErrorMessageContext';

export const App: React.FC = () => {
  return (
    <TodosContextProvider>
      <ErrorMessageContextProvider>
        <TodoApp />
      </ErrorMessageContextProvider>
    </TodosContextProvider>
  );
};
