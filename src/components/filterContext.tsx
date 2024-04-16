/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useMemo, useState } from 'react';

export const FilterContext = React.createContext({
  isCompletedSelected: false,
  setIsCompletedSelected: (_isCompletedSelected: boolean) => {},
  isActiveSelected: false,
  setIsActiveSelected: (_isActiveSelected: boolean) => {},
  isAllSelected: true,
  setIsAllSelected: (_isAllSelected: boolean) => {},
});

type PropsCompleted = {
  children: React.ReactNode;
};

export const FilterProvider: React.FC<PropsCompleted> = ({ children }) => {
  const [isCompletedSelected, setIsCompletedSelected] = useState(false);
  const [isActiveSelected, setIsActiveSelected] = useState(false);
  const [isAllSelected, setIsAllSelected] = useState(true);

  const value = useMemo(
    () => ({
      isCompletedSelected,
      setIsCompletedSelected,
      isActiveSelected,
      setIsActiveSelected,
      isAllSelected,
      setIsAllSelected,
    }),
    [isCompletedSelected, isActiveSelected, isAllSelected],
  );

  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  );
};
