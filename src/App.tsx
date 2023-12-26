import React from 'react';
import { AuthContextProvider } from './components/AuthContextProvider';
import { TodoAppContent } from './components/TodoAppContent';

export const App: React.FC = () => {
  return (
    <AuthContextProvider>
      <div className="todoapp">
        <h1 className="todoapp__title">todos</h1>

        <TodoAppContent />
      </div>
    </AuthContextProvider>
  );
};
