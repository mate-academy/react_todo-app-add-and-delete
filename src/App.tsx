import React from 'react';
// import { UserWarning } from './UserWarning';

import { TodosProvider } from './components/TodosProvider';
import { TodoApp } from './components/TodoApp';

export const App: React.FC = () => {
  return (
    <div className="todoapp">
      <TodosProvider>
        <TodoApp />
      </TodosProvider>
    </div>
  );
};
