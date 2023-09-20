import React, { useEffect, useState } from 'react';

type TE = {
  error: string;
  setError: (error: string) => void;
};

const DEFAULT_ERRORCONTEXT: TE = {
  error: '',
  setError: () => {},
};

export const ErrorContext = React.createContext(DEFAULT_ERRORCONTEXT);

type Props = {
  children: React.ReactNode;
};

export const ErrorContextProvider: React.FC<Props> = ({ children }) => {
  const [error, setError] = useState('');

  useEffect(() => {
    setTimeout(() => setError(''), 3000);
  }, [error]);

  return (
    <ErrorContext.Provider value={{ error, setError }}>
      {children}
    </ErrorContext.Provider>
  );
};
