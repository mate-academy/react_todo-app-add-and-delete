/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import { UserWarning } from './UserWarning';
import TodoFooter from './components/TodoFooter';
import TodoHeader from './components/TodoHeader';
import TodoList from './components/TodoList';
import TodoNotification from './components/TodoNotification';
import { useTodoContext } from './hooks/useTodoContext';

export const App: React.FC = () => {
  const {
    todosContainer,
    errorMessage,
    USER_ID,
  } = useTodoContext();

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader />

        <TodoList />

        {todosContainer.length > 0 && (
          <TodoFooter />
        )}
      </div>

      {errorMessage.length > 0 && <TodoNotification />}
    </div>
  );
};
