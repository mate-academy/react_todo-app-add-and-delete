import React, { useEffect, useState } from 'react';
import { Todo } from '../../types/Todo';
import { Context } from '../../types/Context';
import { ErrorMessage } from '../../types/ErrorMessages';
import { getTodos } from '../../api/todos';

export const TodosContext = React.createContext<Context>({
  USER_ID: 11813,
  todos: [],
  setTodos: () => { },
  errorMessage: null,
  setErrorMessage: () => { },
  setErrorWithTimeout: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const USER_ID = 11813;
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | null>(null);

  const setErrorWithTimeout = (
    error: ErrorMessage,
    setError: React.Dispatch<React.SetStateAction<ErrorMessage | null>>,
  ) => {
    setError(error);

    setTimeout(() => {
      setError(null);
    }, 3000);
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then(allTodos => {
        setTodos(allTodos as Todo[]);
      })
      .catch(() => {
        setErrorWithTimeout(ErrorMessage.Loading, setErrorMessage);
      });
  }, []);

  const value = {
    USER_ID,
    todos,
    setTodos,
    errorMessage,
    setErrorMessage,
    setErrorWithTimeout,
  };

  return (
    <TodosContext.Provider value={value}>
      {children}
    </TodosContext.Provider>
  );
};
