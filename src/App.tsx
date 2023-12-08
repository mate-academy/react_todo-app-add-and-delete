import React, { useContext } from 'react';

import { TodosContext } from './components/TodosContext';
import { UserWarning } from './UserWarning';

import { TodoHeader } from './components/TodoHeader/TodoHeader';
import { TodoList } from './components/TodoMain/TodoList';
import { TodoFooter } from './components/TodoFooter/TodoFooter';
import { TodoError } from './components/TodoError/TodoError';

export const App: React.FC = () => {
  const { todos, USER_ID } = useContext(TodosContext);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <TodoHeader />

        {!!todos.length && (
          <div className="wrapper">
            <TodoList />
            <TodoFooter />
          </div>
        )}
      </div>

      <TodoError />
    </div>
  );
};
