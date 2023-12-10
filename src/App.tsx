import React from 'react';
import { TodosProvider } from './TodosContext';
import { TodoApp } from './components/TodoApp';
import { TempTodoProvider } from './TempTodoContext';

export const App: React.FC = () => {
  return (
    <TodosProvider>
      <TempTodoProvider>
        <TodoApp />
      </TempTodoProvider>
    </TodosProvider>
  );
};
