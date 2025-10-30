import React from 'react';
import { FilterStatus } from '../types/FilterStatus';
import cn from 'classnames';

interface TodoFilterProps {
  currentFilter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
}

export const Filter: React.FC<TodoFilterProps> = ({
  currentFilter,
  onFilterChange = () => {},
}) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={cn('filter__link', {
          selected: currentFilter === FilterStatus.All,
        })}
        data-cy="FilterLinkAll"
        onClick={() => onFilterChange(FilterStatus.All)}
      >
        All
      </a>

      <a
        href="#/active"
        data-cy="FilterLinkActive"
        className={cn('filter__link', {
          selected: currentFilter === FilterStatus.Active,
        })}
        onClick={() => onFilterChange(FilterStatus.Active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={cn('filter__link', {
          selected: currentFilter === FilterStatus.Completed,
        })}
        onClick={() => onFilterChange(FilterStatus.Completed)}
        data-cy="FilterLinkCompleted"
      >
        Completed
      </a>
    </nav>
  );
};
