import { createContext } from 'react';
import { ErrorState } from '../hooks/useError';

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
