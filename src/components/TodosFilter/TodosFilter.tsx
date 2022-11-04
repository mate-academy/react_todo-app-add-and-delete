import cn from 'classnames';
import React from 'react';
import { FilterBy } from '../../types/FilterBy';

const filterTypes = [
  { id: 1, type: FilterBy.ALL },
  { id: 2, type: FilterBy.ACTIVE },
  { id: 3, type: FilterBy.COMPLETED },
];

type Props = {
  filterBy: FilterBy;
  onFilterChange: (filter: FilterBy) => void;
};

export const TodosFilter: React.FC<Props> = React.memo(({
  filterBy,
  onFilterChange,
}) => (
  <nav className="filter" data-cy="Filter">
    {filterTypes.map(filter => (
      <a
        key={filter.id}
        data-cy="FilterLinkAll"
        href="#/"
        className={cn(
          'filter__link',
          { selected: filterBy === filter.type },
        )}
        onClick={() => onFilterChange(filter.type)}
      >
        {filter.type}
      </a>
    ))}
  </nav>
));
