/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { UserWarning } from './UserWarning';
import * as todosServices from './api/todos';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { useTodos } from './components/TodoContext';

export const App: React.FC = () => {
  const { todos } = useTodos();

  if (!todosServices.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div>
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header />
        {!!todos.length && (
          <>
            <TodoList />
            <Footer />
          </>
        )}
        <ErrorNotification />
      </div>
    </div>
  );
};
