import { createContext, useEffect, useState } from 'react';

interface Props {
  children: React.ReactNode;
}

interface ContextProps {
  error: string | null;
  clearError: VoidFunction;
  onError: (message: string) => void;
}

const defaultValue = {
  error: null,
  onError: () => {},
  clearError: () => {},
};

const ErrorContext = createContext<ContextProps>(defaultValue);

const ErrorContextProvider = ({ children }: Props) => {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (error) {
      const timeoutId = setTimeout(() => {
        setError(null);

        clearTimeout(timeoutId);
      }, 3000);
    }
  }, [error]);

  const onError = (message: string) => {
    setError(message);
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <ErrorContext.Provider value={{ error, onError, clearError }}>
      {children}
    </ErrorContext.Provider>
  );
};

export { ErrorContext, ErrorContextProvider };
