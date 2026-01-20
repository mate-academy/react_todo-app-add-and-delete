import React from 'react';
import classNames from 'classnames';

export type FilterType = 'all' | 'active' | 'completed';

interface Props {
  selectedFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export const Filter: React.FC<Props> = ({ selectedFilter, onFilterChange }) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        className={classNames('filter__link', {
          selected: selectedFilter === 'all',
        })}
        data-cy="FilterLinkAll"
        href="#/"
        onClick={e => {
          e.preventDefault();
          onFilterChange('all');
        }}
      >
        All
      </a>

      <a
        className={classNames('filter__link', {
          selected: selectedFilter === 'active',
        })}
        data-cy="FilterLinkActive"
        href="#/active"
        onClick={e => {
          e.preventDefault();
          onFilterChange('active');
        }}
      >
        Active
      </a>

      <a
        className={classNames('filter__link', {
          selected: selectedFilter === 'completed',
        })}
        data-cy="FilterLinkCompleted"
        href="#/completed"
        onClick={e => {
          e.preventDefault();
          onFilterChange('completed');
        }}
      >
        Completed
      </a>
    </nav>
  );
};
