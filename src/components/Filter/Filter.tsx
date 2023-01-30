import React from 'react';
import cn from 'classnames';
import { FilterType } from '../../types/FilterType';

type Props = {
  filterType: FilterType,
  selectFilterType: (filterType: FilterType) => void;
};

export const Filter: React.FC<Props> = ({ filterType, selectFilterType }) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        data-cy="FilterLinkAll"
        href="#/"
        className={cn('filter__link', {
          selected: filterType === FilterType.ALL,
        })}
        onClick={() => selectFilterType(FilterType.ALL)}
      >
        All
      </a>

      <a
        data-cy="FilterLinkActive"
        href="#/active"
        className={cn('filter__link', {
          selected: filterType === FilterType.ACTIVE,
        })}
        onClick={() => selectFilterType(FilterType.ACTIVE)}
      >
        Active
      </a>
      <a
        data-cy="FilterLinkCompleted"
        href="#/completed"
        className={cn('filter__link', {
          selected: filterType === FilterType.COMPLETED,
        })}
        onClick={() => selectFilterType(FilterType.COMPLETED)}
      >
        Completed
      </a>
    </nav>
  );
};
