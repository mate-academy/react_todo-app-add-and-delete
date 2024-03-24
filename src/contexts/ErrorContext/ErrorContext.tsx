import React, { createContext, useState } from 'react';
import { ErrorContextValue } from './types';

const initialErrorContextState: ErrorContextValue = {
  error: { message: '' },
  setError: () => {},
};

export const ErrorContext = createContext<ErrorContextValue>(
  initialErrorContextState,
);

type Props = {
  children: React.ReactNode;
};

export const ErrorProvider: React.FC<Props> = ({ children }) => {
  const [error, setError] = useState<ErrorContextValue['error']>({
    message: '',
  });

  return (
    <ErrorContext.Provider value={{ error, setError }}>
      {children}
    </ErrorContext.Provider>
  );
};
