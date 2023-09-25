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

interface ILoaddingProvider {
  isLoading: boolean;
  setIsLoading: (newValue: boolean) => void;
}

const initialErrorProvider: ILoaddingProvider = {
  isLoading: false,
  setIsLoading: () => { },
};

export const LoaddingProvider = createContext(initialErrorProvider);

export const Loading: FC<TTodoErrorProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  const provider = useMemo(() => ({
    isLoading,
    setIsLoading,
  }), [isLoading]);

  return (
    <LoaddingProvider.Provider value={provider}>
      {children}
    </LoaddingProvider.Provider>
  );
};
