import { FilterType } from '../Filter/FilterPropTypes';

export type Props = {
  countOfItemsLeft: number;
  setFilterType: (type :FilterType) => void;
  filterType: FilterType;
  clearCompleted: () => void;
  todosLength: number;
};
