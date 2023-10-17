/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { ErrorMessageEnum } from './types/ErrorMessageEnum';
import { USER_ID } from './helpers/UserID';
import { getData } from './helpers/HelperFunctions';
import { TodoApp } from './components/TodoApp/TodoApp';
import { Footer } from './components/Footer/Footer';
import { Query } from './types/Query';
import { QueryEnum } from './types/QueryEnum';
import { getPreparedTodos } from './components/TodosFilter/TodosFilter';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [allTodos, setAllTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessageEnum | ''>('');
  const [query, setQuery] = useState<Query>(QueryEnum.All);

  useEffect(() => {
    getData([setTodos, setAllTodos], setErrorMessage);
  }, []);

  const preparedTodos = getPreparedTodos(todos, query);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoApp
          todos={preparedTodos}
          allTodos={allTodos}
          setTodos={setTodos}
          setAllTodos={setAllTodos}
          setErrorMessage={setErrorMessage}
        />

        <Footer
          allTodos={allTodos}
          setAllTodos={setAllTodos}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
          setQuery={setQuery}
        />

      </div>

      <ErrorMessage
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
