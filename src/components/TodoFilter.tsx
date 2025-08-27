import React from 'react';
import classNames from 'classnames';

import { FilterStatus } from '../types/FilterStatus';

type Props = {
  filterStatus: FilterStatus;
  onFilterChange: (status: FilterStatus) => void;
};

export const TodoFilter: React.FC<Props> = ({
  filterStatus,
  onFilterChange,
}) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: filterStatus === FilterStatus.All,
        })}
        data-cy="FilterLinkAll"
        onClick={() => onFilterChange(FilterStatus.All)}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: filterStatus === FilterStatus.Active,
        })}
        data-cy="FilterLinkActive"
        onClick={() => onFilterChange(FilterStatus.Active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: filterStatus === FilterStatus.Completed,
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => onFilterChange(FilterStatus.Completed)}
      >
        Completed
      </a>
    </nav>
  );
};
