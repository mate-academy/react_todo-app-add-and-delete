import { FC } from 'react';
import cn from 'classnames';
import { StatusFilterType } from '../../types/StatusFilterType';

interface Props {
  filter: StatusFilterType
  onFilterChange: (filter: StatusFilterType) => void
}

export const StatusFilter: FC<Props> = ({ filter, onFilterChange }) => (
  <nav className="filter">
    <a
      href="#/"
      className={cn('filter__link ', {
        selected: filter === StatusFilterType.ALL,
      })}
      onClick={() => onFilterChange(StatusFilterType.ALL)}
    >
      All
    </a>

    <a
      href="#/active"
      className={cn('filter__link ', {
        selected: filter === StatusFilterType.ACTIVE,
      })}
      onClick={() => onFilterChange(StatusFilterType.ACTIVE)}
    >
      Active
    </a>

    <a
      href="#/completed"
      className={cn('filter__link ', {
        selected: filter === StatusFilterType.COMPLETED,
      })}
      onClick={() => onFilterChange(StatusFilterType.COMPLETED)}
    >
      Completed
    </a>
  </nav>
);
