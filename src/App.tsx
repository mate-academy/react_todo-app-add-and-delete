import React, {
  useEffect, useRef, useState,
} from 'react';

import { ErrorNotification } from './components/ErrorNotification';
import { TodoContent } from './components/TodoContent';

export const App: React.FC = () => {
  const [isErrorMessage, setIsErrorMessage] = useState(false);
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <TodoContent
        newTodoField={newTodoField}
        setIsErrorMessage={setIsErrorMessage}
      />

      <ErrorNotification
        isErrorMessage={isErrorMessage}
        setIsErrorMessage={setIsErrorMessage}
      />
    </div>
  );
};
