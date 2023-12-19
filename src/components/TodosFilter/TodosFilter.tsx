import cn from 'classnames';
import { FC } from 'react';
import { Status } from '../../types/Status';

type Props = {
  selectedFilter: Status,
  handleSelectFilter: (status: Status) => void,
};

export const TodosFilter: FC<Props> = ({
  selectedFilter,
  handleSelectFilter,
}) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={cn('filter__link', {
          selected: selectedFilter === Status.ALL,
        })}
        data-cy="FilterLinkAll"
        onClick={() => handleSelectFilter(Status.ALL)}
      >
        {Status.ALL}
      </a>

      <a
        href={`#/${Status.ACTIVE}`}
        className={cn('filter__link', {
          selected: selectedFilter === Status.ACTIVE,
        })}
        data-cy="FilterLinkActive"
        onClick={() => handleSelectFilter(Status.ACTIVE)}
      >
        {Status.ACTIVE}
      </a>

      <a
        href={`#/${Status.COMPLETED}`}
        className={cn('filter__link', {
          selected: selectedFilter === Status.COMPLETED,
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => handleSelectFilter(Status.COMPLETED)}
      >
        {Status.COMPLETED}
      </a>
    </nav>
  );
};
