import React, { createContext, useContext } from 'react';
import { UserWarning } from '../UserWarning';

export const AutorizationContext = createContext<number | null>(null);

export const useAuthorize = () => {
  return useContext(AutorizationContext);
};

type Props = {
  children: React.ReactNode;
};

export const AutorizationProvider: React.FC<Props> = ({ children }) => {
  const USER_ID: number | null = 12071;

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <AutorizationContext.Provider value={USER_ID}>
      {children}
    </AutorizationContext.Provider>
  );
};
