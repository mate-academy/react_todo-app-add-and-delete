import { FC } from 'react';
import cn from 'classnames';
import { StatusFilterType } from '../../types/StatusFilterType';

interface Props {
  filter: StatusFilterType
  onChangeFilter: (filter: StatusFilterType) => void
}

export const StatusFilter: FC<Props> = ({ filter, onChangeFilter }) => (
  <nav className="filter">
    <a
      href="#/"
      className={cn('filter__link ', {
        selected: filter === StatusFilterType.ALL,
      })}
      onClick={() => onChangeFilter(StatusFilterType.ALL)}
    >
      All
    </a>

    <a
      href="#/active"
      className={cn('filter__link ', {
        selected: filter === StatusFilterType.ACTIVE,
      })}
      onClick={() => onChangeFilter(StatusFilterType.ACTIVE)}
    >
      Active
    </a>

    <a
      href="#/completed"
      className={cn('filter__link ', {
        selected: filter === StatusFilterType.COMPLETED,
      })}
      onClick={() => onChangeFilter(StatusFilterType.COMPLETED)}
    >
      Completed
    </a>
  </nav>
);
