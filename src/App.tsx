import React from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { TodoHeader } from './components/TodoHeader';
import { useTodos } from './utils/TodoContext';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { TodoError } from './components/TodoError';

export const App: React.FC = () => {
  const { todos } = useTodos();
  const isTodos = todos.length > 0;

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader />

        {isTodos && <TodoList />}

        {isTodos && <TodoFooter />}
      </div>

      <TodoError />
    </div>
  );
};
