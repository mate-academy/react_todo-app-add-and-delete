/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';

import { TodosProvider } from './components/TodosContext';
import { TodoApp } from './components/TodoApp';
import { TodoError } from './components/TodoError';

export const App: React.FC = () => {
  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <TodosProvider>
        <h1 className="todoapp__title">todos</h1>

        <div className="todoapp__content">
          <TodoApp />
        </div>

        <TodoError />
      </TodosProvider>
    </div>
  );
};
