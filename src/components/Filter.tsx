import classNames from 'classnames';
import React from 'react';
import { FilterStatus } from '../types/FilterStatus';

interface Props {
  selectedFilter: FilterStatus;
  onSelect: (filter: FilterStatus) => void;
}

export const Filter: React.FC<Props> = ({ selectedFilter, onSelect }) => (
  <nav className="filter" data-cy="Filter">
    <a
      href="#/"
      className={classNames('filter__link', {
        selected: selectedFilter === FilterStatus.All,
      })}
      data-cy="FilterLinkAll"
      onClick={() => onSelect(FilterStatus.All)}
    >
      All
    </a>

    <a
      href="#/active"
      className={classNames('filter__link', {
        selected: selectedFilter === FilterStatus.Active,
      })}
      data-cy="FilterLinkActive"
      onClick={() => onSelect(FilterStatus.Active)}
    >
      Active
    </a>

    <a
      href="#/completed"
      className={classNames('filter__link', {
        selected: selectedFilter === FilterStatus.Completed,
      })}
      data-cy="FilterLinkCompleted"
      onClick={() => onSelect(FilterStatus.Completed)}
    >
      Completed
    </a>
  </nav>
);
