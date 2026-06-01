import React from 'react';
import classNames from 'classnames';

export enum FilterType {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

interface FilterProps {
  selectedFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export const Filter: React.FC<FilterProps> = ({
  selectedFilter,
  onFilterChange,
}) => {
  const handleFilterClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    filter: FilterType,
  ) => {
    e.preventDefault();
    onFilterChange(filter);
  };

  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: selectedFilter === FilterType.All,
        })}
        data-cy="FilterLinkAll"
        onClick={e => handleFilterClick(e, FilterType.All)}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: selectedFilter === FilterType.Active,
        })}
        data-cy="FilterLinkActive"
        onClick={e => handleFilterClick(e, FilterType.Active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: selectedFilter === FilterType.Completed,
        })}
        data-cy="FilterLinkCompleted"
        onClick={e => handleFilterClick(e, FilterType.Completed)}
      >
        Completed
      </a>
    </nav>
  );
};
