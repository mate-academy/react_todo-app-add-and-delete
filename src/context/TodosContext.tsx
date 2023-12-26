import React, { createContext, useEffect, useState } from 'react';
import { Todo } from '../types/Todo';
import { Statuses } from '../types/Statuses';
import { getTodos } from '../api/todos';
import { USER_ID } from '../constants/USER_ID';
import { Errors } from '../types/Errors';

type PropsTodosContext = {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  filter: Statuses;
  setFilter: (value: Statuses) => void;
  errorMessage: Errors,
  setErrorMessage: (value: Errors) => void,
  tempTodo: Todo | null,
  setTempTodo: (tempTodo: Todo | null) => void,
  isLoading: boolean,
  setIsLoading: (value: boolean) => void,
};

type Props = {
  children: React.ReactNode;
};

export const TodosContext = createContext<PropsTodosContext>({
  todos: [],
  setTodos: () => { },
  filter: Statuses.All,
  setFilter: () => {},
  errorMessage: Errors.NoErrors,
  setErrorMessage: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  isLoading: false,
  setIsLoading: () => {},
});

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Statuses>(Statuses.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState<Errors>(Errors.NoErrors);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    getTodos(+USER_ID)
      .then(setTodos)
      .catch(() => setErrorMessage(Errors.LoadingError));
  }, []);

  return (
    <TodosContext.Provider value={{
      todos,
      setTodos,
      filter,
      setFilter,
      errorMessage,
      setErrorMessage,
      tempTodo,
      setTempTodo,
      isLoading,
      setIsLoading,
    }}
    >
      {children}
    </TodosContext.Provider>
  );
};
