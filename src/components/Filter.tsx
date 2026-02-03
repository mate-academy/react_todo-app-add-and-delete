import React from 'react';
import classNames from 'classnames';
import { FilterStatus } from '../types/FilterStatus';

type Props = {
  filterStatus: FilterStatus;
  onFilterClick: (status: FilterStatus) => void;
};

export const Filter: React.FC<Props> = ({ filterStatus, onFilterClick }) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: filterStatus === FilterStatus.All,
        })}
        data-cy="FilterLinkAll"
        onClick={() => onFilterClick(FilterStatus.All)}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: filterStatus === FilterStatus.Active,
        })}
        data-cy="FilterLinkActive"
        onClick={() => onFilterClick(FilterStatus.Active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: filterStatus === FilterStatus.Completed,
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => onFilterClick(FilterStatus.Completed)}
      >
        Completed
      </a>
    </nav>
  );
};
