/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { createContext, useRef, useState } from 'react';
import { Errors } from '../types/Errors';

type Props = {
  children: React.ReactNode;
};

export const ErrorContext = createContext({
  error: Errors.Empty,
  errorVisibility: false,
  showError: (_errorText: Errors) => {},
  setErrorVisibility: (_value: boolean) => {},
});

export const ErrorContextProvider: React.FC<Props> = ({ children }) => {
  const [error, setError] = useState(Errors.Empty);
  const [errorVisibility, setErrorVisibility] = useState(false);

  const errorTimerId = useRef<NodeJS.Timeout | null>(null);

  const showError = (errorText: Errors) => {
    setError(errorText);
    setErrorVisibility(true);

    if (errorTimerId.current) {
      clearTimeout(errorTimerId.current);
    }

    errorTimerId.current = setTimeout(() => {
      setErrorVisibility(false);
    }, 3000);
  };

  return (
    <ErrorContext.Provider value={{
      error,
      errorVisibility,
      showError,
      setErrorVisibility,
    }}
    >
      {children}
    </ErrorContext.Provider>
  );
};
