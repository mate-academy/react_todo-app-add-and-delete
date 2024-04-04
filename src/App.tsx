/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */

import React from 'react';
import { USER_ID } from './api/todos';
import { useTodos } from './utils/TodoContext';
import { UserWarning } from './UserWarning';
import { Header } from './components/Header';
import { Foofer } from './components/Foofer';
import { TodoList } from './components/TodoList';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const { todos } = useTodos();

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />
        {!!todos.length && (
          <>
            <TodoList />
            <Foofer />
          </>
        )}
      </div>
      <ErrorNotification />
    </div>
  );
};
