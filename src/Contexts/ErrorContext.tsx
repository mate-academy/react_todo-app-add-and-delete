import { createContext, useState } from 'react';
import { ErrorMessage } from '../types/Error';

type SetErrorContextType = React.Dispatch<React.SetStateAction<ErrorMessage>>;

export const ErrorContext = createContext<ErrorMessage>(ErrorMessage.noError);
export const SetErrorContext = createContext<SetErrorContextType>(() => []);

type Props = {
  children: React.ReactNode;
};

export const ErrorContextProvider: React.FC<Props> = ({ children }) => {
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>(
    ErrorMessage.noError,
  );

  return (
    <ErrorContext.Provider value={errorMessage}>
      <SetErrorContext.Provider value={setErrorMessage}>
        {children}
      </SetErrorContext.Provider>
    </ErrorContext.Provider>
  );
};
