import { useState, useMemo } from 'react';
import { createContext } from 'react';

interface LoadingProps {
  loadingIds: number[];
  setLoadingIds: React.Dispatch<React.SetStateAction<number[]>>;
}

export const LoadingContext = createContext<LoadingProps>({
  loadingIds: [],
  setLoadingIds: () => {},
});

export const LoadingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  const value = useMemo(
    () => ({
      loadingIds,
      setLoadingIds,
    }),
    [loadingIds],
  );

  return (
    <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
  );
};
