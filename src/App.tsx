/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';

import { TodoApp } from './components/TodoApp';
import { TodoProvider } from './contexts/TodoContext';
import { FormProvider } from './contexts/FormContext';

export const App: React.FC = () => (
  <TodoProvider>
    <FormProvider>
      <TodoApp />
    </FormProvider>
  </TodoProvider>
);
