import React from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import {
  ErrorNotification,
  TodoFooter,
  TodoHeader,
  TodoList,
} from './components';
import { useTodos } from './utils/TodosContext';

export const App: React.FC = () => {
  const { todos } = useTodos();

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
            <TodoList />
            <TodoFooter />
          </>
        )}
      </div>
      <ErrorNotification />
    </div>
  );
};
