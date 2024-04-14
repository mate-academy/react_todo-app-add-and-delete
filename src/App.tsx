/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext } from 'react';
// import { UserWarning } from './UserWarning';
// import { USER_ID } from './api/todos';
import { TodoAppHeader } from './components/TodoAppHeader';
import { TodoAppMain } from './components/TodoAppMain';
import { TodoAppFooter } from './components/TodoAppFooter';
import { TodoAppError } from './components/TodoAppError';
import { StateContext } from './context/ContextReducer';

export const App: React.FC = () => {
  const { todoApi } = useContext(StateContext);
  // if (!USER_ID) {
  //   return <UserWarning />;
  // }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoAppHeader />

        <TodoAppMain />
        {/* Hide the footer if there are no todos */}
        {todoApi.length !== 0 && <TodoAppFooter />}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <TodoAppError />
    </div>
  );
};
