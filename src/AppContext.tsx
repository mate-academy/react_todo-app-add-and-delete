import React, { Dispatch, SetStateAction, useState } from 'react';
import { ErrorType } from './types/ErrorType';
import { FilterStatus } from './types/FilterStatus';
import { TempTodo, Todo } from './types/Todo';

interface IAppContext {
  error: ErrorType;
  setError: Dispatch<SetStateAction<ErrorType>>
  filterStatus: FilterStatus;
  setFilterStatus: Dispatch<SetStateAction<FilterStatus>>;
  todos: Todo[];
  setTodos:Dispatch<SetStateAction<Todo[]>>;
  isLoading: boolean;
  setIsLoading:Dispatch<SetStateAction<boolean>>;
  tempTodo: null | TempTodo;
  setTempTodo: Dispatch<SetStateAction<TempTodo | null>>
}

export const AppContext = React.createContext<IAppContext>({
  error: ErrorType.None,
  setError: () => {},
  filterStatus: FilterStatus.All,
  setFilterStatus: () => {},
  todos: [],
  setTodos: () => {},
  isLoading: false,
  setIsLoading: () => {},
  tempTodo: null,
  setTempTodo: () => {},
});

type Props = {
  children: React.ReactNode
};

export const AppProvider: React.FC<Props> = ({ children }) => {
  const [error, setError] = useState(ErrorType.None);
  const [filterStatus, setFilterStatus] = useState(FilterStatus.All);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<TempTodo | null>(null);

  return (
    <AppContext.Provider value={{
      error,
      setError,
      filterStatus,
      setFilterStatus,
      todos,
      setTodos,
      isLoading,
      setIsLoading,
      tempTodo,
      setTempTodo,
    }}
    >
      {children}
    </AppContext.Provider>
  );
};
