/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { TodoList } from './components/TodoList/TodoList';

export const App: React.FC = () => {
  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <TodoList />
    </div>
  );
};
