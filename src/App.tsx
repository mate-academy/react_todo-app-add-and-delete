/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext } from 'react';
import { UserWarning } from './UserWarning';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { TodoContext } from './context/todoContext';
import { ErrorNotification } from './ErrorNotification';
import { USER_ID } from './consts';

export const App: React.FC = () => {
  const { visibleFooter, error, onErrorHandler } = useContext(TodoContext);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader />
        <TodoList />
        {visibleFooter !== 0 && (
          <TodoFooter />
        )}
      </div>
      <ErrorNotification
        error={error}
        onErrorHandler={onErrorHandler}
      />
    </div>
  );
};
