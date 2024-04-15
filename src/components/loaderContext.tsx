import React, { useMemo, useState } from 'react';

export const LoaderConstext = React.createContext({
  isLoaderActive: false,
  setIsLoaderActive: (isLoaderActive: boolean) => {
    // eslint-disable-next-line no-console
    console.log(isLoaderActive);
  },
});

type PropsLoader = {
  children: React.ReactNode;
};

export const LoaderProvider: React.FC<PropsLoader> = ({ children }) => {
  const [isLoaderActive, setIsLoaderActive] = useState(false);

  const value = useMemo(
    () => ({
      isLoaderActive,
      setIsLoaderActive,
    }),
    [isLoaderActive],
  );

  return (
    <LoaderConstext.Provider value={value}>{children}</LoaderConstext.Provider>
  );
};
