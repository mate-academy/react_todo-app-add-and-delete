import {
  useState, createContext, useMemo,
} from 'react';

export const ErrorContext = createContext<{
  errorMessage: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  isErrorHidden: boolean;
  setIsErrorHidden: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  errorMessage: '',
  setErrorMessage: () => {},
  isErrorHidden: true,
  setIsErrorHidden: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const ErrorProvider: React.FC<Props> = ({ children }) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [isErrorHidden, setIsErrorHidden] = useState(true);

  const value = useMemo(() => ({
    errorMessage,
    setErrorMessage,
    isErrorHidden,
    setIsErrorHidden,
  }), [errorMessage, isErrorHidden]);

  return (
    <ErrorContext.Provider value={value}>
      {children}
    </ErrorContext.Provider>
  );
};
