import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { UserTodos } from './components/UserTodos/UserTodos';
import { TodoError } from './components/TodoError/TodoError';

export const App: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [isErrorVisible, setIsErrorVisible] = useState(false);

  useEffect(() => {
    if (errorMessage) {
      setIsErrorVisible(true);
      setTimeout(() => {
        setErrorMessage('');
        setIsErrorVisible(false);
      }, 3000);
    }
  }, [errorMessage]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <UserTodos userId={USER_ID} onError={setErrorMessage} />

      <TodoError
        errorMessage={errorMessage}
        isVisible={isErrorVisible}
        onClose={() => setErrorMessage('')}
      />
    </div>
  );
};
