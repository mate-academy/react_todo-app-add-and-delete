import { createContext, Dispatch, SetStateAction } from 'react';

interface ITodoContextValue {
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  errorMessage: string;
  setErrorMessage: Dispatch<SetStateAction<string>>;
  tempTodoText: string;
  setTempTodoText: Dispatch<SetStateAction<string>>;
}

export const TodoContext = createContext({} as ITodoContextValue);
