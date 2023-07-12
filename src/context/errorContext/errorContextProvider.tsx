import {
  FC,
  ReactNode,
  memo,
  useMemo,
  useState,
} from 'react';
import { ErrorContext, ErrorContextProps } from './errorContext';

interface Props {
  children: ReactNode,
}

export const ErrorContextProvider: FC<Props> = memo(({ children }) => {
  const [errorMessage, setErrorMessage] = useState('');

  const notifyAboutError = (text: string) => {
    setErrorMessage(text);
  };

  const value: ErrorContextProps = useMemo(() => ({
    errorMessage,
    notifyAboutError,
  }), [errorMessage]);

  return (
    <ErrorContext.Provider value={value}>
      {children}
    </ErrorContext.Provider>
  );
});
