import {
  ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';

import { ErrorMessage } from '../types/ErrorMessage';
import { ErrorState } from '../types/ErrorState';

const initialState: ErrorState = [
  '',
  () => { },
];

const ErrorsContext = createContext(initialState);

type Props = {
  children: ReactNode,
};

export const ErrorsContextProvider: React.FC<Props> = ({ children }) => {
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>('');

  const value: ErrorState = useMemo(() => ([
    errorMessage,
    setErrorMessage,
  ]), [errorMessage, setErrorMessage]);

  return (
    <ErrorsContext.Provider value={value}>
      {children}
    </ErrorsContext.Provider>
  );
};

export const useErrorsState = () => useContext(ErrorsContext);
