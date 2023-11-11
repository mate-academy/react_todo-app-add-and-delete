/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';

import { TodosProvider } from './components/TodoContext/TodoContext';
import { TodoHeader } from './components/TodoHeader/TodoHeader';
import { TodoList } from './components/TodoList/TodoList';
import { TodoFooter } from './components/TodoFooter/TodoFooter';
import { TodoError } from './components/TodoError/TodoError';

export const App: React.FC = () => {
  return (
    <TodosProvider>
      <div className="todoapp">

        <h1 className="todoapp__title">todos</h1>

        <div className="todoapp__content">
          <TodoHeader />
          <TodoList />
          <TodoFooter />
        </div>

        <TodoError />
      </div>
    </TodosProvider>
  );
};
