import React, { useMemo, useState } from 'react';
import { FilterType } from '../types/SortType';

type FilterContextType = {
  filter: FilterType,
  setFilter: React.Dispatch<React.SetStateAction<FilterType>>,
};

type Props = {
  children: React.ReactNode,
};

export const FilterContext = React.createContext<FilterContextType>({
  filter: FilterType.All,
  setFilter: () => {},
});

export const FilterContextProvider = ({ children }: Props) => {
  const [filter, setFilter] = useState(FilterType.All);

  const contextValue = useMemo(() => (
    {
      filter,
      setFilter,
    }
  ), [filter]);

  return (
    <FilterContext.Provider value={contextValue}>
      {children}
    </FilterContext.Provider>
  );
};
