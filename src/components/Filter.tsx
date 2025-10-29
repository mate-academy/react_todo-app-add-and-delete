import React from 'react';
import classNames from 'classnames';
import { FilterStatus } from '../types/FilterStatus';

type Props = {
  currentFilter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
};

export const Filter: React.FC<Props> = ({ currentFilter, onFilterChange }) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: currentFilter === FilterStatus.All,
        })}
        data-cy="FilterLinkAll"
        onClick={e => {
          e.preventDefault();
          onFilterChange(FilterStatus.All);
        }}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: currentFilter === FilterStatus.Active,
        })}
        data-cy="FilterLinkActive"
        onClick={e => {
          e.preventDefault();
          onFilterChange(FilterStatus.Active);
        }}
      >
        Active
      </a>
      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: currentFilter === FilterStatus.Completed,
        })}
        data-cy="FilterLinkCompleted"
        onClick={e => {
          e.preventDefault();
          onFilterChange(FilterStatus.Completed);
        }}
      >
        Completed
      </a>
    </nav>
  );
};
