import React, { memo } from 'react';
import cn from 'classnames';
import { FilterType } from '../../types/FilterType';

interface Props {
  complitedFilter: FilterType,
  setComplitedFilter: (filter: FilterType) => void,
}

export const Filter:React.FC<Props> = memo(({
  complitedFilter,
  setComplitedFilter,
}) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        data-cy="FilterLinkAll"
        className={cn('filter__link', {
          selected: complitedFilter === FilterType.All,
        })}
        onClick={() => setComplitedFilter(FilterType.All)}
      >
        All
      </a>

      <a
        data-cy="FilterLinkActive"
        href="#/active"
        className={cn('filter__link', {
          selected: complitedFilter === FilterType.Active,
        })}
        onClick={() => setComplitedFilter(FilterType.Active)}
      >
        Active
      </a>
      <a
        data-cy="FilterLinkCompleted"
        href="#/completed"
        className={cn('filter__link', {
          selected: complitedFilter === FilterType.Completed,
        })}
        onClick={() => setComplitedFilter(FilterType.Completed)}
      >
        Completed
      </a>
    </nav>
  );
});
