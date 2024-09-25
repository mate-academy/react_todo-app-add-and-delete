import React, { createContext, useState } from 'react';
import { Error } from '../types/Error';

interface ErrorContextType {
  errorMessage: Error | null;
  handleErrorMessage: (error: Error | null) => void;
}

export const ErrorContext = createContext<ErrorContextType>({
  errorMessage: null,
  handleErrorMessage: () => {},
});

type ProviderProps = {
  children: React.ReactNode;
};

export const ErrorProvider: React.FC<ProviderProps> = ({ children }) => {
  const [errorMessage, setErrorMessage] = useState<Error | null>(null);

  const handleErrorMessage = (error: Error | null) => {
    setErrorMessage(error);
    setTimeout(() => {
      setErrorMessage(null);
    }, 3000);
  };

  return (
    <ErrorContext.Provider value={{ errorMessage, handleErrorMessage }}>
      {children}
    </ErrorContext.Provider>
  );
};
