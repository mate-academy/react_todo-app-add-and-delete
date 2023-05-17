import { createContext, useState } from 'react';
import { FilterType } from '../../types/FilterType';

export const FilterContext = createContext<{
  filterType: FilterType,
  setFilterType:(newFilter: FilterType) => void,
}>({
      filterType: FilterType.All,
      setFilterType: () => {},
    });

interface Props {
  children: React.ReactNode;
}

export const FilterContextProvider: React.FC<Props> = ({ children }) => {
  const [filterType, setFilterType] = useState(FilterType.All);

  return (
    <FilterContext.Provider value={{ filterType, setFilterType }}>
      {children}
    </FilterContext.Provider>
  );
};
