/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useMemo, useState } from 'react';
import { FilterStatuses } from '../data/enums';

export const FilterContext = React.createContext({
  selectedFilter: 'All',
  setSelectedFilter: (_selectedFilter: string) => {},
});

type PropsCompleted = {
  children: React.ReactNode;
};

export const FilterProvider: React.FC<PropsCompleted> = ({ children }) => {
  const [selectedFilter, setSelectedFilter] = useState(FilterStatuses.All);

  const value = useMemo(
    () => ({
      selectedFilter,
      setSelectedFilter,
    }),
    [selectedFilter, setSelectedFilter],
  );

  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  );
};
