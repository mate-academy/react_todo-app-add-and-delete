import React, { ReactNode, useState } from 'react';
import { ErrorValues } from '../types/ErrorValues';

type Props = {
  children: ReactNode,
};

type ContextValues = {
  hideError: boolean,
  setHideError: (change: boolean) => void,
  errorMessage: ErrorValues | null,
  setErrorMessage: (error: ErrorValues | null) => void,
};

export const ErrorContext = React.createContext({} as ContextValues);

export const ErrorContextProvider: React.FC<Props> = ({ children }) => {
  const [hideError, setHideError] = useState(true);
  const [errorMessage, setErrorMessage] = useState<ErrorValues | null>(null);

  const contextValues = {
    hideError,
    setHideError,
    errorMessage,
    setErrorMessage,
  };

  return (
    <ErrorContext.Provider value={contextValues}>
      {children}
    </ErrorContext.Provider>

  );
};
