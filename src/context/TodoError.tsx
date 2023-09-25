import {
  FC,
  useState,
  createContext,
  ReactNode,
  useMemo,
} from 'react';

type TTodoErrorProps = {
  children: ReactNode;
};

export interface IError {
  message: string;
  hasError: boolean;
}

interface IErrorProvider {
  error: IError;
  setError: (callback: (prev: IError) => IError) => void;
}

const initialErrorProvider: IErrorProvider = {
  error: {
    message: '',
    hasError: false,
  },
  setError: () => { },
};

export const ErrorProvider = createContext(initialErrorProvider);

export const TodoError: FC<TTodoErrorProps> = ({ children }) => {
  const [error, setError] = useState({
    message: '',
    hasError: false,
  });

  const provider = useMemo(() => ({
    error,
    setError,
  }), [error]);

  return (
    <ErrorProvider.Provider value={provider}>
      {children}
    </ErrorProvider.Provider>
  );
};
