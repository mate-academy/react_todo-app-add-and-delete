import React from 'react';
import { FilterStatus } from '../../types/FilterStatus';
import classNames from 'classnames';

type Props = {
  filterStatus: FilterStatus;
  onFilterChange: (filterStatus: FilterStatus) => void;
};

export const TodosFilter: React.FC<Props> = ({
  filterStatus,
  onFilterChange,
}) => (
  <nav className="filter" data-cy="Filter">
    <a
      href="#/"
      className={classNames({
        filter__link: true,
        selected: filterStatus === FilterStatus.all,
      })}
      data-cy="FilterLinkAll"
      onClick={() => onFilterChange(FilterStatus.all)}
    >
      All
    </a>

    <a
      href="#/active"
      className={classNames({
        filter__link: true,
        selected: filterStatus === FilterStatus.active,
      })}
      data-cy="FilterLinkActive"
      onClick={() => onFilterChange(FilterStatus.active)}
    >
      Active
    </a>

    <a
      href="#/completed"
      className={classNames({
        filter__link: true,
        selected: filterStatus === FilterStatus.completed,
      })}
      data-cy="FilterLinkCompleted"
      onClick={() => onFilterChange(FilterStatus.completed)}
    >
      Completed
    </a>
  </nav>
);
