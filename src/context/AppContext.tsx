import React, { createContext, useContext, useRef, useState } from 'react';

import { CustomError } from '../types/Error';
import { FilterValues } from '../types/FilterValues';
import { LoadingTodo } from '../types/LoadingTodo';
import { Todo } from '../types/Todo';

interface AppContextProps {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  error: CustomError;
  setError: React.Dispatch<React.SetStateAction<CustomError>>;
  filter: FilterValues;
  setFilter: React.Dispatch<React.SetStateAction<FilterValues>>;
  loadingTodos: LoadingTodo[];
  setLoadingTodos: React.Dispatch<React.SetStateAction<LoadingTodo[]>>;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  isFormDisabled: boolean;
  setIsFormDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  isNewTodoFieldEdited: boolean;
  setIsNewTodoFieldEdited: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AppContext = createContext<AppContextProps | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [query, setQuery] = useState(''); // for new todo title
  const [error, setError] = useState<CustomError>('');
  const [filter, setFilter] = useState<FilterValues>(FilterValues.All);
  const [loadingTodos, setLoadingTodos] = useState<LoadingTodo[]>([]);
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const [isNewTodoFieldEdited, setIsNewTodoFieldEdited] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <AppContext.Provider
      value={{
        todos,
        setTodos,
        query,
        setQuery,
        error,
        setError,
        filter,
        setFilter,
        loadingTodos,
        setLoadingTodos,
        inputRef,
        isFormDisabled,
        setIsFormDisabled,
        isNewTodoFieldEdited,
        setIsNewTodoFieldEdited,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context: AppContextProps | undefined = useContext(AppContext);

  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }

  return context;
}
