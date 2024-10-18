import React, { useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { TodoErrors } from './components/TodoErrors';
import { TodoContent } from './components/TodoContent';

export const App: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState('');

  const errorFunction = (message: string) => {
    setErrorMessage(message);

    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <TodoContent errorFunction={errorFunction} />
      <TodoErrors errorMessage={errorMessage} closeError={setErrorMessage} />
    </div>
  );
};
