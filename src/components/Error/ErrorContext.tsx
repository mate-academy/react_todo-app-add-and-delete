import React, { useState } from 'react';
import { ErrorContextType } from '../../types/ErrorContextType';

export const ErrorContext = React.createContext<ErrorContextType | null>(null);

type Props = {
  children: React.ReactNode;
};

export const ErrorProvider: React.FC<Props> = ({ children }) => {
  const [isError, setIsError] = useState(false);
  const [errorText, setErrorText] = useState('');

  return (
    <ErrorContext.Provider value={{
      isError,
      setIsError,
      errorText,
      setErrorText,
    }}
    >
      {children}
    </ErrorContext.Provider>
  );
};
