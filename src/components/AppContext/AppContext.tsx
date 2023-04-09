import React, { useCallback, useMemo, useState } from 'react';

import { Todo } from '../../types/Todo';
import { FilterMode } from '../../types/FilterMode';

interface IContextValue {
  userId: number,
  allTodos: Todo[],
  setAllTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  activeTodos: Todo[],
  completedTodosIds: number[],
  tempTodo: Todo | null,
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>,
  shouldShowError: boolean,
  setShouldShowError: React.Dispatch<React.SetStateAction<boolean>>,
  errorMessage: string,
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
  showError: (errorText: string) => void,
  loadingTodosIds: number[],
  setLoadingTodosIds: React.Dispatch<React.SetStateAction<number[]>>,
  currentFilterMode: FilterMode,
  setCurrentFilterMode: React.Dispatch<React.SetStateAction<FilterMode>>,
}

export const AppContext = React.createContext<IContextValue>({
  userId: 0,
  allTodos: [],
  setAllTodos: () => {},
  activeTodos: [],
  completedTodosIds: [],
  tempTodo: null,
  setTempTodo: () => {},
  shouldShowError: false,
  setShouldShowError: () => {},
  errorMessage: '',
  setErrorMessage: () => {},
  showError: () => {},
  loadingTodosIds: [0],
  setLoadingTodosIds: () => {},
  currentFilterMode: FilterMode.All,
  setCurrentFilterMode: () => {},
});

type Props = {
  children: React.ReactNode,
};

export const AppProvider: React.FC<Props> = ({ children }) => {
  const userId = useMemo(() => 6826, []);

  const [allTodos, setAllTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [shouldShowError, setShouldShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingTodosIds, setLoadingTodosIds] = useState<number[]>([0]);
  const [
    currentFilterMode,
    setCurrentFilterMode,
  ] = useState<FilterMode>(FilterMode.All);

  const activeTodos = useMemo(() => (
    allTodos.filter(({ completed }) => !completed)
  ), [allTodos]);

  const completedTodosIds = useMemo(() => (
    allTodos
      .filter(({ completed }) => completed)
      .map(({ id }) => id)
  ), [allTodos]);

  const showError = useCallback((errorText: string) => {
    setErrorMessage(errorText);
    setShouldShowError(true);
    setTimeout(() => {
      setShouldShowError(false);
    }, 3000);
  }, []);

  const contextValue = useMemo(() => {
    return {
      userId,
      allTodos,
      setAllTodos,
      activeTodos,
      completedTodosIds,
      tempTodo,
      setTempTodo,
      shouldShowError,
      setShouldShowError,
      errorMessage,
      setErrorMessage,
      showError,
      loadingTodosIds,
      setLoadingTodosIds,
      currentFilterMode,
      setCurrentFilterMode,
    };
  }, [
    userId,
    allTodos,
    tempTodo,
    shouldShowError,
    errorMessage,
    currentFilterMode,
    loadingTodosIds,
  ]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};
