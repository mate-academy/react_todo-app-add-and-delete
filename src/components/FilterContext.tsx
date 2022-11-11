import React, { useState } from 'react';
import { Filter } from '../enums/Filter';

type PropsContext = {
  selectedFilterStatus: Filter,
  setFilterStatus: (string: Filter) => void,
};

export const FilterContext = React.createContext<PropsContext>({
  selectedFilterStatus: Filter.All,
  setFilterStatus: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const FilterProvider: React.FC<Props> = ({ children }) => {
  const [selectedFilterStatus, setFilterStatus] = useState(Filter.All);

  const contextValue = {
    selectedFilterStatus: selectedFilterStatus,
    setFilterStatus: setFilterStatus,
  };

  return (
    <FilterContext.Provider value={contextValue}>
      {children}
    </FilterContext.Provider>
  );
};
