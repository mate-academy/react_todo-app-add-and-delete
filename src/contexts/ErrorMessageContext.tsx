import { createContext, useState } from 'react';
import { ErrorMessage } from '../types';

type SetErrorMessageType = React.Dispatch<React.SetStateAction<ErrorMessage>>;

export const ErrorMessageContext = createContext<ErrorMessage>(
  ErrorMessage.noError,
);
export const SetErrorMessageContext = createContext<SetErrorMessageType>(
  () => [],
);

type Props = {
  children: React.ReactNode;
};

export const ErrorMessageContextProvider: React.FC<Props> = ({ children }) => {
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>(
    ErrorMessage.noError,
  );

  return (
    <ErrorMessageContext.Provider value={errorMessage}>
      <SetErrorMessageContext.Provider value={setErrorMessage}>
        {children}
      </SetErrorMessageContext.Provider>
    </ErrorMessageContext.Provider>
  );
};
