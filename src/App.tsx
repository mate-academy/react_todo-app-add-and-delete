import React from 'react';
import { TodoApp } from './components/TodoApp';
import { ErrorProvider } from './contexts/ErrorContext';
import { FormInputProvider } from './contexts/FormInputContext';
import { TodosProvaider } from './contexts/TodosContext';

export const App: React.FC = () => {
  return (
    <ErrorProvider>
      <TodosProvaider>
        <FormInputProvider>
          <TodoApp />
        </FormInputProvider>
      </TodosProvaider>
    </ErrorProvider>
  );
};
