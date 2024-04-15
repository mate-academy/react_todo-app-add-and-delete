import React, { useMemo, useState } from 'react';

export const ErrorConstext = React.createContext({
  errorMessage: '',
  setErrorMessage: (errorMessage: string) => {
    // eslint-disable-next-line no-console
    console.log(errorMessage);
  },
});

type PropsError = {
  children: React.ReactNode;
};

export const ErrorProvider: React.FC<PropsError> = ({ children }) => {
  const [errorMessage, setErrorMessage] = useState('');

  const value = useMemo(
    () => ({
      errorMessage,
      setErrorMessage,
    }),
    [errorMessage],
  );

  return (
    <ErrorConstext.Provider value={value}>{children}</ErrorConstext.Provider>
  );
};
