import React, { createContext, useCallback, useState } from 'react';
import { TodoContext } from '../../types/TodoContext';
import { Todo } from '../../types/Todo';
import { Errors } from '../../types/Errors';
import { Status } from '../../types/Status';

export const TodosContext = createContext({} as TodoContext);

type Props = {
  children: React.ReactNode;
};

export const TodosContextProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<Errors>(Errors.noErrors);
  const [filter, setFilter] = useState<Status>(Status.all);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  const resetError = useCallback(() => {
    setTimeout(() => setErrorMessage(Errors.noErrors), 3000);
  }, [setErrorMessage]);

  const value = {
    todos,
    setTodos,
    errorMessage,
    setErrorMessage,
    filter,
    setFilter,
    resetError,
    loadingIds,
    setLoadingIds,
  };

  return (
    // eslint-disable-next-line prettier/prettier
    <TodosContext.Provider value={value}>
      {children}
    </TodosContext.Provider>
  );
};
