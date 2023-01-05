import { FC } from 'react';
import cn from 'classnames';

const filterStatuses = {
  All: 'All',
  Active: 'Active',
  Completed: 'Completed',
};

interface Props {
  filterStatus: string,
  onFilter: React.Dispatch<React.SetStateAction<string>>,
}

export const Filter: FC<Props> = ({ filterStatus, onFilter }) => (
  <nav className="filter" data-cy="Filter">
    <a
      data-cy="FilterLinkAll"
      href="#/"
      className={cn(
        'filter__link',
        { selected: filterStatus === filterStatuses.All },
      )}
      onClick={() => onFilter(filterStatuses.All)}
    >
      All
    </a>

    <a
      data-cy="FilterLinkActive"
      href="#/active"
      className={cn(
        'filter__link',
        { selected: filterStatus === filterStatuses.Active },
      )}
      onClick={() => onFilter(filterStatuses.Active)}
    >
      Active
    </a>
    <a
      data-cy="FilterLinkCompleted"
      href="#/completed"
      className={cn(
        'filter__link',
        { selected: filterStatus === filterStatuses.Completed },
      )}
      onClick={() => onFilter(filterStatuses.Completed)}
    >
      Completed
    </a>
  </nav>
);
