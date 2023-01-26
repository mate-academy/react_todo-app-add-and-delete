import React, { memo } from 'react';
import cn from 'classnames';
import { FilterStatus } from '../../types/FilterStatus';

type Props = {
  filterStatus: string;
  setFilterStatus: React.Dispatch<React.SetStateAction<FilterStatus>>;
};

export const Filter: React.FC<Props> = memo((props) => {
  const { filterStatus, setFilterStatus } = props;

  return (
    <nav className="filter" data-cy="Filter">
      <a
        data-cy="FilterLinkAll"
        href="#/"
        className={cn(
          'filter__link',
          { selected: filterStatus === FilterStatus.All },
        )}
        onClick={() => setFilterStatus(FilterStatus.All)}
      >
        All
      </a>

      <a
        data-cy="FilterLinkActive"
        href="#/active"
        className={cn(
          'filter__link',
          { selected: filterStatus === FilterStatus.Active },
        )}
        onClick={() => setFilterStatus(FilterStatus.Active)}
      >
        Active
      </a>

      <a
        data-cy="FilterLinkCompleted"
        href="#/completed"
        className={cn(
          'filter__link',
          { selected: filterStatus === FilterStatus.Completed },
        )}
        onClick={() => setFilterStatus(FilterStatus.Completed)}
      >
        Completed
      </a>
    </nav>
  );
});
