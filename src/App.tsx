/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { TodoList } from './components/TodosList';
import { Error } from './components/Error';
import { TodoHeader } from './components/TodoHeader';

export const App: React.FC = () => {
  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader />
        <TodoList />
      </div>
      <Error />
    </div>
  );
};
