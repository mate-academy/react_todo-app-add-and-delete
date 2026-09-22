import React from 'react';
import { FILTER, FilterType } from '../../constants/Filter';
import cn from 'classnames';

type Props = {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
};

export const Filter: React.FC<Props> = ({ filter, onFilterChange }) => {
  const handleFilterChange = (
    event: React.MouseEvent<HTMLAnchorElement>,
    selectedFilter: FilterType,
  ) => {
    event.preventDefault();
    onFilterChange(selectedFilter);
  };

  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={cn('filter__link', { selected: filter === FILTER.all })}
        data-cy="FilterLinkAll"
        onClick={event => handleFilterChange(event, FILTER.all)}
      >
        All
      </a>

      <a
        href="#/active"
        className={cn('filter__link', { selected: filter === FILTER.active })}
        data-cy="FilterLinkActive"
        onClick={event => handleFilterChange(event, FILTER.active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={cn('filter__link', {
          selected: filter === FILTER.completed,
        })}
        data-cy="FilterLinkCompleted"
        onClick={event => handleFilterChange(event, FILTER.completed)}
      >
        Completed
      </a>
    </nav>
  );
};
