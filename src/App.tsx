/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext } from 'react';
import { UserWarning } from './components/UserWarning';
import { TodoHeader } from './components/TodoHeader';
import { TodoFooter } from './components/TodoFooter';
import { TodoList } from './components/TodoList';
import { ErrorMessage } from './components/ErrorMessage';
import { TodoContext, USER_ID } from './context/TodoContext';

export const App: React.FC = () => {
  const { todos } = useContext(TodoContext);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <>
        <h1 className="todoapp__title">todos</h1>
        <div className="todoapp__content">
          <TodoHeader />
          {todos.length > 0 && (
            <>
              <TodoList />
              <TodoFooter />
            </>
          )}
        </div>
        <ErrorMessage />
      </>
    </div>
  );
};
