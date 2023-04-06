import React, { useMemo, useState } from 'react';

interface IContextValue {
  loadingTodosIds: number[],
  setLoadingTodosIds: React.Dispatch<React.SetStateAction<number[]>>,
}

export const LoadingTodosContext = React.createContext<IContextValue>({
  loadingTodosIds: [0],
  setLoadingTodosIds: () => {},
});

type Props = {
  children: React.ReactNode,
};

export const LoadingTodosProvider: React.FC<Props> = ({ children }) => {
  const [loadingTodosIds, setLoadingTodosIds] = useState<number[]>([0]);

  const contextValue = useMemo(() => {
    return {
      loadingTodosIds,
      setLoadingTodosIds,
    };
  }, [loadingTodosIds]);

  return (
    <LoadingTodosContext.Provider value={contextValue}>
      {children}
    </LoadingTodosContext.Provider>
  );
};
