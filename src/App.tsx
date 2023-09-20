/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';

import { USER_ID } from './utils/user';

import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter/TodoFooter';
import { TodoErrorMessage } from './components/TodoErrorMessage';
import { UseTodosContext } from './utils/TodosContext';
import { TodoHeader } from './components/TodoHeader';

export const App: React.FC = () => {
  const context = UseTodosContext();

  const {
    todos,
    tempTodo,
  } = context;

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <TodoHeader />

        {(Boolean(todos.length) || tempTodo) && (
          <>
            <TodoList />

            <TodoFooter />
          </>
        )}

      </div>

      <TodoErrorMessage />
    </div>
  );
};
