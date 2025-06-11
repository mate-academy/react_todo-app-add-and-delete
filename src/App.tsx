/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import { UserWarning } from './UserWarning';
import { TodoappContent } from './components/TodoappContent';
import { ErrorNotification } from './components/ErrorNotification';
import { USER_ID } from './api/todos';

export const App: React.FC = () => {
  const [errorNotification, setErrorNotification] = useState('');

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <TodoappContent setErrorNotification={setErrorNotification} />

      <ErrorNotification
        errorNotification={errorNotification}
        setErrorNotification={setErrorNotification}
      />
    </div>
  );
};
