import React from 'react';
import { Todos } from './components/Todos';

export const App: React.FC = () => {
  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <Todos />
    </div>
  );
};
