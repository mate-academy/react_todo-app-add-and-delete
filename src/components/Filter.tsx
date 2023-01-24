import { FC, memo } from 'react';
import cn from 'classnames';
import { FilterEnum } from '../types/filterEnum';

interface Props {
  filterStatus: FilterEnum,
  onFilter: React.Dispatch<React.SetStateAction<FilterEnum>>,
}

export const Filter: FC<Props> = memo(
  ({ filterStatus, onFilter }) => (
    <nav className="filter" data-cy="Filter">
      <a
        data-cy="FilterLinkAll"
        href="#/"
        className={cn(
          'filter__link',
          { selected: filterStatus === FilterEnum.All },
        )}
        onClick={() => onFilter(FilterEnum.All)}
      >
        All
      </a>

      <a
        data-cy="FilterLinkActive"
        href="#/active"
        className={cn(
          'filter__link',
          { selected: filterStatus === FilterEnum.Active },
        )}
        onClick={() => onFilter(FilterEnum.Active)}
      >
        Active
      </a>
      <a
        data-cy="FilterLinkCompleted"
        href="#/completed"
        className={cn(
          'filter__link',
          { selected: filterStatus === FilterEnum.Completed },
        )}
        onClick={() => onFilter(FilterEnum.Completed)}
      >
        Completed
      </a>
    </nav>
  ),
);
