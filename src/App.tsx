import React from 'react';
import { TodosProvider } from './context/TodosContext';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoContent } from './components/TodoContent';

export const App: React.FC = () => {
  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <TodosProvider>

        <TodoContent />

        <ErrorNotification />

      </TodosProvider>

    </div>
  );
};
