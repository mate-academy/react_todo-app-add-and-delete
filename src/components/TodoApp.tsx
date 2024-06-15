import React from 'react';

import { USER_ID } from '../api/todos';
import { UserWarning } from '../UserWarning';
import { TodoError } from './TodoError';
import { TodoHeader } from './TodoHeader';
import { TodoMain } from './TodoMain';
import { TodoFooter } from './TodoFooter';

export const TodoApp: React.FC = () => {
  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <TodoHeader />
        <TodoMain />
        <TodoFooter />
      </div>

      <TodoError />
    </div>
  );
};
