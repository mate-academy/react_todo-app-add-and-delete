/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { UserWarning } from './UserWarning';
import { TodoFooter } from './components/todofooter/todofooter';
import { TodoErr } from './components/todoerr/todoerr';
import { TodoForm } from './components/todoform/todoform';
import { TodoList } from './components/todolist/todolist';
import { USER_ID } from './utils/userID';

export const App: React.FC = () => {
  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoForm />

        <TodoList />

        <TodoFooter />

      </div>

      <TodoErr />

    </div>
  );
};
