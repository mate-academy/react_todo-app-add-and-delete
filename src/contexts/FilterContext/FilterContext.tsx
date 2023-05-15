import { createContext } from 'react';
import { FilterType } from '../../types/FilterType';

export const FilterContext = createContext<{
  filter: FilterType,
  setFilter:(newFilter: FilterType) => void,
}>({
      filter: FilterType.All,
      setFilter: () => {},
    });
