import React from 'react';
import { useTodos } from '../Context';
import { UserWarning } from '../../UserWarning';
import { TodoHeader } from '../TodoHeader';
import { TodoFooter } from '../TodoFooter';
import { TodoList } from '../TodoList';
import { ErrorNotification } from '../ErrorNotification';

export const TodoApp: React.FC = () => {
  const { USER_ID, todos } = useTodos();

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader />

        <TodoList />

        {todos.length !== 0 && (
          <>
            <TodoFooter />
          </>
        )}
      </div>

      <ErrorNotification />
    </div>
  );
};
