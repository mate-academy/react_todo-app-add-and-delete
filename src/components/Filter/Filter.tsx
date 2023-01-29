import React, { memo } from 'react';
import cn from 'classnames';

import { FilterStatus } from '../../types/FilterStatus';

type Props = {
  filterStatus: FilterStatus;
  changeFilterStatus: React.Dispatch<React.SetStateAction<FilterStatus>>;
};

export const Filter: React.FC<Props> = memo((props) => {
  const { filterStatus: statusFilter, changeFilterStatus } = props;

  return (
    <nav className="filter" data-cy="Filter">
      <a
        data-cy="FilterLinkAll"
        href="#/"
        className={cn('filter__link', {
          selected: statusFilter === FilterStatus.All,
        })}
        onClick={() => changeFilterStatus(FilterStatus.All)}
      >
        All
      </a>

      <a
        data-cy="FilterLinkActive"
        href="#/active"
        className={cn('filter__link', {
          selected: statusFilter === FilterStatus.Active,
        })}
        onClick={() => changeFilterStatus(FilterStatus.Active)}
      >
        Active
      </a>

      <a
        data-cy="FilterLinkCompleted"
        href="#/completed"
        className={cn('filter__link', {
          selected: statusFilter === FilterStatus.Completed,
        })}
        onClick={() => changeFilterStatus(FilterStatus.Completed)}
      >
        Completed
      </a>
    </nav>
  );
});
