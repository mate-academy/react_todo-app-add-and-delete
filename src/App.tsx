/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext } from 'react';
import { UserWarning } from './UserWarning';
import { TodoContext } from './components/TodoContex';
import TodoFooter from './components/TodoFooter';
import TodoError from './components/TodoError';
import TodoList from './components/TodoList';
import TodoHeader from './components/TodoHeader';

const USER_ID = 11947;

export const App: React.FC = () => {
  const { todos } = useContext(TodoContext);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (

    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader />
        {todos.length !== 0 && (
          <>
            <TodoList />
            <TodoFooter />
          </>
        )}
      </div>

      <TodoError />
    </div>
  );
};
