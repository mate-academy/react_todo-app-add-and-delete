import React from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import TodoList from './components/TodoList';
import ErrorMessages from './components/ErrorMessages';
import { ErrorMessagesNotification } from './api/todos';
import { useState } from 'react';

export const App: React.FC = () => {
  const [error, setError] = useState<ErrorMessagesNotification | null>(null);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoList error={error} setError={setError} />
      </div>
      <ErrorMessages error={error} setError={setError} />
    </div>
  );
};
