import React, { useState } from 'react';

export const LoaderContext = React.createContext<any>(null);

type Props = {
  children: React.ReactNode;
};

export const LoaderProvider: React.FC<Props> = ({ children }) => {
  const [isLoaderActive, setIsLoaderActive] = useState(false);

  return (
    <LoaderContext.Provider value={[isLoaderActive, setIsLoaderActive]}>
      {children}
    </LoaderContext.Provider>
  );
};
