import { memo } from 'react';
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
        data-cy="FilterLinkAll"
        href="#/"
        className={cn('filter__link', {
          selected: complitedFilter === FilterType.ALL,
        })}
        onClick={() => setComplitedFilter(FilterType.ALL)}
      >
        All
      </a>

      <a
        data-cy="FilterLinkActive"
        href="#/active"
        className={cn('filter__link', {
          selected: complitedFilter === FilterType.ACTIVE,
        })}
        onClick={() => setComplitedFilter(FilterType.ACTIVE)}
      >
        Active
      </a>
      <a
        data-cy="FilterLinkCompleted"
        href="#/completed"
        className={cn('filter__link', {
          selected: complitedFilter === FilterType.COMPLETED,
        })}
        onClick={() => setComplitedFilter(FilterType.COMPLETED)}
      >
        Completed
      </a>
    </nav>
  );
});
