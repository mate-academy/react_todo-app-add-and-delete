import React, { useContext, useEffect, useState } from 'react';

import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { TodoNotification } from './components/TodoNotification';
import { TodoContext } from './context/TodoContext';
import { getTodos } from './api/todos';
import { USER_ID } from './utils/variables';

export const App: React.FC = () => {
  const { todos, setTodos } = useContext(TodoContext);

  const [errorMessage, setErrorMessage] = useState('');
  const [isErrorHidden, setIsErrorHidden] = useState(true);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          onAddError={(message) => setErrorMessage(message)}
          onHideError={(value) => setIsErrorHidden(value)}
        />

        <TodoList />

        {!!todos.length && <TodoFooter />}
      </div>

      <TodoNotification
        errorMessage={errorMessage}
        isErrorHidden={isErrorHidden}
        onHideError={(value) => setIsErrorHidden(value)}
      />
    </div>
  );
};
