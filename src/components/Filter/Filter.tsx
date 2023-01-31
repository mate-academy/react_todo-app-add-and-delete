import React from 'react';
import cn from 'classnames';
import { FilterStatus } from '../../types/FilterStatus';

type Props = {
  filterStatus: FilterStatus;
  onFilterSelect: (status: FilterStatus) => void;
};

export const Filter: React.FC<Props> = ({ filterStatus, onFilterSelect }) => {
  return (
    <>
      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={cn('filter__link', { selected: filterStatus === 'All' })}
          onClick={() => onFilterSelect('All')}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={cn(
            'filter__link',
            { selected: filterStatus === 'Active' },
          )}
          onClick={() => onFilterSelect('Active')}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={cn(
            'filter__link',
            { selected: filterStatus === 'Completed' },
          )}
          onClick={() => onFilterSelect('Completed')}
        >
          Completed
        </a>
      </nav>
    </>
  );
};
