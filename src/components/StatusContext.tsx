import React, { useState } from 'react';
import { Status } from '../enums/Status';

type PropsContext = {
  selectStatus: Status,
  setSelectStatus: (string: Status) => void,
};

export const StatusContext = React.createContext<PropsContext>({
  selectStatus: Status.All,
  setSelectStatus: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const StatusProvider: React.FC<Props> = ({ children }) => {
  const [selectStatus, setSelectStatus] = useState(Status.All);

  const contextValue = {
    selectStatus,
    setSelectStatus,
  };

  return (
    <StatusContext.Provider value={contextValue}>
      {children}
    </StatusContext.Provider>
  );
};
