import {
  useMemo,
  useState,
  useEffect,
  useContext,
  createContext,
} from 'react';

import { ERRORS } from '../utils';

type ErrorContextValue = {
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
};

export const ErrorContext = createContext<ErrorContextValue>({
  error: ERRORS.NONE,
  setError: () => {},
});

export function useError() {
  return useContext(ErrorContext);
}

type Props = {
  children: React.ReactNode;
};

export const ErrorProvider: React.FC<Props> = ({ children }) => {
  const [error, setError] = useState(ERRORS.NONE);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setError(ERRORS.NONE);
    }, 3000);

    return () => {
      window.clearTimeout(timerId);
    };
  }, []);

  const contextValue = useMemo(() => ({
    error,
    setError,
  }), [error]);

  return (
    <ErrorContext.Provider value={contextValue}>
      {children}
    </ErrorContext.Provider>
  );
};
