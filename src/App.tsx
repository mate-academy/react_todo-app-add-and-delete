import React, { useEffect, useState } from 'react';

import { getTodos } from './api/todos';
import { Content } from './components/Content';
import { Errors } from './components/Errors';
import { UserWarning } from './UserWarning';

import { Error } from './types/Error';
import { Todo } from './types/Todo';

const USER_ID = 6192;

export const App: React.FC = () => {
  const [allTodos, setAllTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<Error>(Error.success);

  useEffect(() => {
    getTodos(USER_ID).then(setAllTodos);
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <Content
        todos={allTodos}
        changeTodos={setAllTodos}
        userId={USER_ID}
        onError={setError}
      />

      {!error.length || (<Errors errorMessage={error} />)}
    </div>
  );
};
