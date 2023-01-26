import React, { Dispatch, SetStateAction, useState } from 'react';
import { ErrorType } from './types/ErrorType';
import { FilterStatus } from './types/FilterStatus';

interface IAppContext {
  error: ErrorType;
  setError: Dispatch<SetStateAction<ErrorType>>
  filterStatus: FilterStatus;
  setFilterStatus: Dispatch<SetStateAction<FilterStatus>>
}

export const AppContext = React.createContext<IAppContext>({
  error: ErrorType.None,
  setError: () => {},
  filterStatus: FilterStatus.All,
  setFilterStatus: () => {},
});

type Props = {
  children: React.ReactNode
};

export const AppProvider: React.FC<Props> = ({ children }) => {
  const [error, setError] = useState(ErrorType.None);
  const [filterStatus, setFilterStatus] = useState(FilterStatus.All);

  return (
    <AppContext.Provider value={{
      error,
      setError,
      filterStatus,
      setFilterStatus,
    }}
    >
      {children}
    </AppContext.Provider>
  );
};
