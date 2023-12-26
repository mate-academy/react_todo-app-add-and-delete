import React, { useContext } from 'react';
import { UserWarning } from '../UserWarning';
import { USER_ID } from '../constants/USER_ID';
import { TodosContext } from '../context/TodosContext';
import { TodoHeader } from './TodoHeader';
import { TodoMain } from './TodoMain';
import { TodoFooter } from './TodoFooter';
import { TodoErrors } from './TodoErrors';

export const TodoApp: React.FC = () => {
  const { todos } = useContext(TodosContext);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader />

        {!!todos.length && (
          <>
            <TodoMain />

            <TodoFooter />
          </>
        )}
      </div>

      <TodoErrors />
    </div>
  );
};
