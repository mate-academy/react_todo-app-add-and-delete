import React, { ReactNode } from 'react';

export const UserIdContext = React.createContext(6511);

type Props = {
  children: ReactNode;
};

export const UserIdProvider: React.FC<Props> = ({ children }) => {
  return (
    <UserIdContext.Provider value={6511}>
      {children}
    </UserIdContext.Provider>
  );
};
