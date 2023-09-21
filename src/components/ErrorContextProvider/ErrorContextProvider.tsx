import React, { useState } from 'react';

export const ErrorContext = React.createContext({
  errorMessage: '',
  setErrorMessage: () => {},
  hasError: false,
  setHasError: () => {},
  onNewError: () => {},
} as ErrorContextProps);

type ErrorContextProps = {
  errorMessage: string,
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
  hasError: boolean,
  setHasError: React.Dispatch<React.SetStateAction<boolean>>,
  onNewError: (error: string) => void,
};

type Props = {
  children: React.ReactNode,
};

export const ErrorContextProvider: React.FC<Props> = ({ children }) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [hasError, setHasError] = useState(false);

  const onNewError = (error: string) => {
    setErrorMessage(error);
    setHasError(true);

    setTimeout(() => {
      setHasError(false);
    }, 3000);
  };

  const initialValue = {
    errorMessage,
    setErrorMessage,
    hasError,
    setHasError,
    onNewError,
  };

  return (
    <ErrorContext.Provider value={initialValue}>
      {children}
    </ErrorContext.Provider>
  );
};
