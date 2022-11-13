import React, { useRef, useState } from 'react';
import { ErrorTodo } from '../../types/ErrorTodo';
import { SortParam } from '../../types/SortParam';
import { Todo } from '../../types/Todo';

type AppContextType = {
  sortBy: SortParam,
  setSortBy: React.Dispatch<React.SetStateAction<SortParam>>,
  errorTodo: ErrorTodo | null,
  showErrorMessage: (typeError: ErrorTodo | null) => void,
  closeErrorMessage: () => void,
  timerId: React.MutableRefObject<number>,
  todosFromServer?: Todo[],
  setTodosFromServer: React.Dispatch<React.SetStateAction<Todo[] | undefined>>,
  idOfTodosForLoader: number[];
  setIdOfTodosForLoader: React.Dispatch<React.SetStateAction<number[]>>,
};

export const AppContext = React.createContext<AppContextType>({
  sortBy: SortParam.All,
  setSortBy: () => {},
  errorTodo: null,
  showErrorMessage: () => {},
  closeErrorMessage: () => {},
  timerId: 0 as unknown as React.MutableRefObject<number>,
  todosFromServer: undefined,
  setTodosFromServer: () => {},
  idOfTodosForLoader: [],
  setIdOfTodosForLoader: () => {},
});

export const AppProvider: React.FC<React.DetailedHTMLProps<
React.HTMLAttributes<HTMLDivElement>, HTMLDivElement
>> = ({ children }) => {
  const [sortBy, setSortBy] = useState(SortParam.All);
  const [errorTodo, setErrorTodo] = useState<ErrorTodo | null>(null);
  const [todosFromServer, setTodosFromServer] = useState<Todo[]>();
  const [idOfTodosForLoader, setIdOfTodosForLoader] = useState<number[]>([]);
  const timerId = useRef<number>(0);

  const showErrorMessage = (typeError: ErrorTodo | null) => {
    setErrorTodo(typeError);
    timerId.current = window.setTimeout(() => {
      setErrorTodo(null);
    }, 3000);
  };

  const closeErrorMessage = () => {
    setErrorTodo(null);
    clearTimeout(timerId.current);
  };

  const contextApp = {
    sortBy,
    setSortBy,
    errorTodo,
    showErrorMessage,
    closeErrorMessage,
    timerId,
    todosFromServer,
    setTodosFromServer,
    idOfTodosForLoader,
    setIdOfTodosForLoader,
  };

  return (
    <AppContext.Provider value={contextApp}>
      {children}
    </AppContext.Provider>
  );
};
