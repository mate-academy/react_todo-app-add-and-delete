import { TodoFilterItem } from '../TodoFilterItem';

import { todoFilters } from '../../constants/todoFilters';

import type { FilterBy } from '../../types/Filter';

type Props = {
  filterBy: FilterBy;
  onFilterSelect: (filterBy: FilterBy) => void;
};

export const TodoFilter = ({ filterBy, onFilterSelect }: Props) => {
  return (
    <nav className="filter" data-cy="Filter">
      {todoFilters.map(filter => (
        <TodoFilterItem
          key={filter.value}
          filter={filter}
          currentFilter={filterBy}
          onFilterSelect={onFilterSelect}
        />
      ))}
    </nav>
  );
};
