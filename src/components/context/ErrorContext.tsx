import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react';
import { TodoError } from '../../types/enums';

interface ErrorContextType {
  errorMessage: TodoError | null;
  setErrorMessage: Dispatch<SetStateAction<TodoError | null>>;
}

const ErrorContext = createContext<ErrorContextType | null>(null);

interface Props {
  children: React.ReactNode;
}

export const ErrorProvider: React.FC<Props> = ({ children }) => {
  const [errorMessage, setErrorMessage] = useState<TodoError | null>(null);

  return (
    <ErrorContext.Provider value={{ errorMessage, setErrorMessage }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = () => {
  const context = useContext(ErrorContext);

  if (!context) {
    throw new Error('useError must be used within an ErrorProvider');
  }

  return context;
};
