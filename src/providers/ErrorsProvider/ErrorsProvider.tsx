import {
  createContext, useContext,
} from 'react';
import { useErrors } from '../../CustomHooks/useErrors';

type ErrorsContextType = ReturnType<typeof useErrors>;

export const ErrorsContext
= createContext<ErrorsContextType | undefined>(undefined);

type ErrorsProviderProps = {
  children: React.ReactNode
};

export const ErrorsProvider = ({ children }: ErrorsProviderProps) => {
  const { ...args } = useErrors();

  return (
    <ErrorsContext.Provider value={{ ...args }}>
      {children}
    </ErrorsContext.Provider>
  );
};

export const useErrorsContext = () => {
  const contextValues = useContext(ErrorsContext);

  if (!contextValues) {
    throw new Error('ErrorsContext must be in ErrorsProvider');
  }

  return contextValues;
};
