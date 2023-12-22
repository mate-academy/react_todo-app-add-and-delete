import React, { useState } from 'react';

export const ErrorContext = React.createContext({
  isError: false as boolean,
  setIsError: (() => {}) as React.Dispatch<React.SetStateAction<boolean>>,
});
export const ErrorsMessageContext = React.createContext({
  errorsMesage: 'load' as string,
  setErrorsMesage: (() => {}) as React.Dispatch<React.SetStateAction<string>>,
});
type Props = {
  children:React.ReactNode
};

export const ErrorContextProvider : React.FC<Props> = ({ children }) => {
  const [isError, setIsError] = useState(false);
  const [errorsMesage, setErrorsMesage] = useState('load');

  return (
    <ErrorContext.Provider value={{ isError, setIsError }}>
      <ErrorsMessageContext.Provider value={{ errorsMesage, setErrorsMesage }}>
        {children}
      </ErrorsMessageContext.Provider>
    </ErrorContext.Provider>
  );
};
