import React, { useMemo, useState } from 'react';

type ErrorState = {
  error: string,
  setError: (error: string) => void,
  isErrorShown: boolean,
  setIsErrorShown: (value: boolean) => void,
  showError: (error: string) => void,
};

export const ErrorContext = React.createContext<ErrorState>({
  error: '',
  setError: () => {},
  isErrorShown: false,
  setIsErrorShown: () => {},
  showError: () => {},
});

interface Props {
  children: React.ReactNode,
}

export const ErrorProvider: React.FC<Props> = ({ children }) => {
  const [error, setError] = useState('');
  const [isErrorShown, setIsErrorShown] = useState(false);

  const showError = (newError: string) => {
    setError(newError);
    setIsErrorShown(true);

    setTimeout(() => {
      setIsErrorShown(false);
      setError('');
    }, 3000);
  };

  const value = useMemo(() => ({
    error,
    setError,
    isErrorShown,
    setIsErrorShown,
    showError,
  }), [error, isErrorShown]);

  return (
    <ErrorContext.Provider value={value}>
      {children}
    </ErrorContext.Provider>
  );
};
