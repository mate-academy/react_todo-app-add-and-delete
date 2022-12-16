import React from 'react';
import classNames from 'classnames';
// import { FilterStatus } from '../Footer/Footer';

export enum FilterStatus {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

type Props = {
  filterStatus: FilterStatus,
  setFilterStatus: (filter: FilterStatus) => void,
};

export const NavFooter: React.FC<Props> = ({
  filterStatus, setFilterStatus,
}) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        data-cy="FilterLinkAll"
        href="#/"
        className={classNames('filter__link', {
          selected: filterStatus === FilterStatus.All,
        })}
        onClick={() => setFilterStatus(FilterStatus.All)}
      >
        All
      </a>

      <a
        data-cy="FilterLinkActive"
        href="#/active"
        className={classNames('filter__link', {
          selected: filterStatus === FilterStatus.Active,
        })}
        onClick={() => setFilterStatus(FilterStatus.Active)}
      >
        Active
      </a>
      <a
        data-cy="FilterLinkCompleted"
        href="#/completed"
        className={classNames('filter__link', {
          selected: filterStatus === FilterStatus.Completed,
        })}
        onClick={() => setFilterStatus(FilterStatus.Completed)}
      >
        Completed
      </a>
    </nav>
  );
};
