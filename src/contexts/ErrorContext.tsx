import React, { useCallback, useState } from 'react';

export interface ErrorType {
  error: string;
  setError: (errorMessage: string) => void;
}

export const ErrorContext = React.createContext<ErrorType>({
  error: '',
  setError: () => {},
});

export const ErrorContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [error, setError] = useState('');

  const checkError = useCallback((text: string) => {
    setError(text);

    setTimeout(() => {
      setError('');
    }, 3000);
  }, []);

  return (
    <ErrorContext.Provider
      value={{
        error: error,
        setError: (errorMessage: string) => checkError(errorMessage),
      }}
    >
      {children}
    </ErrorContext.Provider>
  );
};
