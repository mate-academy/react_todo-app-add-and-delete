/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useEffect, useState } from 'react';
import { ErrorOfTodo } from './components/ErrorOfTodo';
import { ListOfTodo } from './components/ListOfTodo';
import { NewTodo } from './components/NewTodo';
import { Error } from './types/Error';
import { User } from './types/User';
import { Todo } from './types/Todo';
import { getTodos } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const [userTodos, setUserTodos] = useState<Todo[]>([]);
  const [hasTodos, setHasTodos] = useState(false);
  const [hasError, setHasError] = useState<Error>({ status: false });

  const handleLoadTodos = async () => {
    try {
      setHasError({ status: false });

      const todosFromServer = await getTodos((user as User).id);

      setUserTodos(todosFromServer);
    } catch {
      setHasError({ status: true });
      setTimeout(() => {
        setHasError({ status: false });
      }, 3000);
    }
  };

  const handleCloseError = () => {
    setHasError({ status: false });
  };

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    handleLoadTodos();
  }, []);

  useEffect(() => {
    if (userTodos.length !== 0) {
      setHasTodos(true);
    } else {
      setHasTodos(false);
    }
  }, [userTodos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <NewTodo
            todos={userTodos}
            hasTodos={hasTodos}
            handleLoadTodos={handleLoadTodos}
          />
        </header>
        {hasTodos && (
          <ListOfTodo todos={userTodos} handleLoadTodos={handleLoadTodos} />
        )}
        {hasError.status && (
          <ErrorOfTodo
            message={hasError.message}
            onCloseError={handleCloseError}
          />
        )}
      </div>
    </div>
  );
};
