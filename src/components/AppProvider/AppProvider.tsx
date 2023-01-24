import React, { useContext, useEffect, useState } from 'react';

import { getTodos } from '../../api/todos';
import { AuthContext } from '../Auth/AuthContext';

import { Error, ContextProps } from '../../types';
import { Todo } from '../../types/Todo';

export const AppContext = React.createContext<ContextProps>({
  todos: [],
  error: Error.None,
  tempTodo: null,
  isLoadingMany: false,
  isDeleting: false,
  setTodos: () => {},
  setError: () => {},
  setTempTodo: () => {},
  setIsLoadingMany: () => {},
  setIsDeleting: () => {},
});

type Props = {
  children: React.ReactNode
};

export const AppProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoadingMany, setIsLoadingMany] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(Error.None);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const user = useContext(AuthContext);

  useEffect(() => {
    // eslint-disable-next-line func-names
    (async function () {
      if (user) {
        setTodos(await getTodos(user.id));
      }
    }());
  }, []);

  const contextValue = {
    todos,
    error,
    tempTodo,
    isLoadingMany,
    isDeleting,
    setTodos,
    setError,
    setTempTodo,
    setIsLoadingMany,
    setIsDeleting,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};
