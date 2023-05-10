import React, { ReactNode, useState } from 'react';

type LangContextType = {
  loadDelete: number[];
  setLoadDelete: (loadDelete: number[]) => void;
};

export const LoadDeleteContext = React.createContext<LangContextType>({
  loadDelete: [],
  setLoadDelete: () => {},
});

interface LangProviderProps {
  children: ReactNode;
}

export const LoadDeleteProvider = ({ children }: LangProviderProps) => {
  const [loadDelete, setLoadDelete] = useState<number[]>([]);

  const contextValue = {
    loadDelete,
    setLoadDelete,
  };

  return (
    <LoadDeleteContext.Provider value={contextValue}>
      {children}
    </LoadDeleteContext.Provider>
  );
};
