/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { UserWarning } from './UserWarning';
import { Header } from './component/Header';
import { Footer } from './component/Footer';
import { TodoList } from './component/TodoList';
import { ErrorNotification } from './component/ErrorNotification';

import { useTodos } from './utils/TodoContext';
import { USER_ID } from './api/todos';

export const App: React.FC = () => {
  const { todos } = useTodos();

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        {!!todos.length && (
          <>
            <TodoList />
            <Footer />
          </>
        )}
      </div>

      <ErrorNotification />
    </div>
  );
};
