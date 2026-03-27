import { useMemo } from 'react';
import { createContext } from 'react';
import { ErrorState, useError } from '../hooks/useError';

export interface ErrorContextProps extends ErrorState {
  showError: (message: string) => void;
  closeError: () => void;
}

export const ErrorContext = createContext<ErrorContextProps>({
  isError: false,
  errorMessage: '',
  showError: () => {},
  closeError: () => {},
});

export const ErrorProvider = ({ children }: { children: React.ReactNode }) => {
  const { error, showError, closeError } = useError();

  const value = useMemo(
    () => ({
      ...error,
      showError,
      closeError,
    }),
    [error, showError, closeError],
  );

  return (
    <ErrorContext.Provider value={value}>{children}</ErrorContext.Provider>
  );
};
