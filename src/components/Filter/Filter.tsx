import classNames from 'classnames';
import React from 'react';

export const enum FilterStatus {
  All,
  Active,
  Completed,
}

type Props = {
  status: FilterStatus;
  handleStatusChange: (newStatus: FilterStatus) => void;
};

export const Filter: React.FC<Props> = ({ handleStatusChange, status }) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        data-cy="FilterLinkAll"
        onClick={() => handleStatusChange(FilterStatus.All)}
        className={classNames('filter__link', {
          selected: status === FilterStatus.All,
        })}
      >
        All
      </a>

      <a
        href="#/active"
        data-cy="FilterLinkActive"
        onClick={() => handleStatusChange(FilterStatus.Active)}
        className={classNames('filter__link', {
          selected: status === FilterStatus.Active,
        })}
      >
        Active
      </a>

      <a
        href="#/completed"
        data-cy="FilterLinkCompleted"
        onClick={() => handleStatusChange(FilterStatus.Completed)}
        className={classNames('filter__link', {
          selected: status === FilterStatus.Completed,
        })}
      >
        Completed
      </a>
    </nav>
  );
};
