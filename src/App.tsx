import React from 'react';

import { UserWarning } from './UserWarning';
import { USER_ID } from './utils/todos';

import { TodoList } from './components/TodoList/TodoList';

import { ErrorNotification } from './components/ErrorNotification';

import { useTodos } from './components/context/TodosContext';
import { TodoFooter } from './components/TodoFooter/TodoFooter';
import { TodoHeader } from './components/TodoHeader/TodoHeader';

export const App: React.FC = () => {
  const { todos } = useTodos();

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <section className="section container">
      <div className="todoapp">
        <h1 className="todoapp__title">todos</h1>

        <div className="todoapp__content">
          <TodoHeader />
          <TodoList />
          {todos.length > 0 && <TodoFooter />}
        </div>

        <ErrorNotification />
      </div>
    </section>
  );
};
