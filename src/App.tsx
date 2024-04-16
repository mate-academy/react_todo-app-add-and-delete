/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { TodoAppHeader } from './components/TodoAppHeader';
import { TodoAppMain } from './components/TodoAppMain';
import { TodoAppFooter } from './components/TodoAppFooter';
import { TodoAppError } from './components/TodoAppError';
import { StateContext } from './context/ContextReducer';

export const App: React.FC = () => {
  const { todoApi, select } = useContext(StateContext);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoAppHeader />

        <TodoAppMain />

        {(todoApi.length !== 0 || select !== 'All') && <TodoAppFooter />}
      </div>

      <TodoAppError />
    </div>
  );
};
