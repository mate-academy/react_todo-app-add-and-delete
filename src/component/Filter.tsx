import classNames from 'classnames';
import React from 'react';

export type FilterType = 'all' | 'active' | 'completed';

type Props = {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
};

export const Filter: React.FC<Props> = ({ currentFilter, onFilterChange }) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: currentFilter === 'all',
        })}
        data-cy="FilterLinkAll"
        onClick={event => {
          event.preventDefault();
          onFilterChange('all');
        }}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: currentFilter === 'active',
        })}
        data-cy="FilterLinkActive"
        onClick={event => {
          event.preventDefault();
          onFilterChange('active');
        }}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: currentFilter === 'completed',
        })}
        data-cy="FilterLinkCompleted"
        onClick={event => {
          event.preventDefault();
          onFilterChange('completed');
        }}
      >
        Completed
      </a>
    </nav>
  );
};
