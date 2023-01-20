import React, { useState } from 'react';
import { LoaderContextType } from '../../types/LoaderContextType';

export const LoaderContext
= React.createContext<LoaderContextType | null>(null);

type Props = {
  children: React.ReactNode;
};

export const LoaderProvider: React.FC<Props> = ({ children }) => {
  const [isLoaderActive, setIsLoaderActive] = useState<boolean>(false);

  return (
    <LoaderContext.Provider value={{ isLoaderActive, setIsLoaderActive }}>
      {children}
    </LoaderContext.Provider>
  );
};
