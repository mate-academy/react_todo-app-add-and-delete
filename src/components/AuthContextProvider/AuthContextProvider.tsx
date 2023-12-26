import React from 'react';
import { UserWarning } from '../../UserWarning';
import { AuthContext } from '../../Context/Context';

type Props = {
  children: React.ReactNode;
};

export const AuthContextProvider: React.FC<Props> = ({ children }) => {
  const USER_ID = 12040;

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <AuthContext.Provider value={USER_ID}>
      {children}
    </AuthContext.Provider>
  );
};
