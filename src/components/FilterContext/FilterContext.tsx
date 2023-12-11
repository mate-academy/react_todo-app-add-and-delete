import {
  createContext,
  useMemo,
  useState,
} from 'react';
import { FilterBy } from '../../types/FilterBy';

type ContextTodos = {
  filterBy: FilterBy;
  setFilterBy: (newVlue: FilterBy) => void;
};

export const FilterContext = createContext<ContextTodos>({
  filterBy: FilterBy.ALL,
  setFilterBy: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const FilterByProvider: React.FC<Props> = ({ children }) => {
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.ALL);

  const value = useMemo(() => ({
    filterBy,
    setFilterBy,
  }), [filterBy]);

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
};
