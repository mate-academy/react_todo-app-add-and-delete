/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useMemo, useState } from 'react';

export const FilterContext = React.createContext({
  isSelected: 'All',
  setIsSelected: (_isSelected: string) => {},
});

type PropsCompleted = {
  children: React.ReactNode;
};

export const FilterProvider: React.FC<PropsCompleted> = ({ children }) => {
  const [isSelected, setIsSelected] = useState('All');

  const value = useMemo(
    () => ({
      isSelected,
      setIsSelected,
    }),
    [isSelected, setIsSelected],
  );

  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  );
};
