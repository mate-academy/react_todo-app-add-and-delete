import cn from 'classnames';
import React from 'react';
import { Status } from '../../types/Status';

type Props = {
  filterStatus: Status;
  setFilterStatus: React.Dispatch<React.SetStateAction<Status>>;
};

export const TodoFilter: React.FC<Props> = ({
  filterStatus,
  setFilterStatus,
}) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        href={Status.All}
        className={cn('filter__link',
          { selected: filterStatus === Status.All })}
        data-cy="FilterLinkAll"
        onClick={() => setFilterStatus(Status.All)}
      >
        All
      </a>

      <a
        href={Status.Active}
        className={cn('filter__link',
          { selected: filterStatus === Status.Active })}
        data-cy="FilterLinkActive"
        onClick={() => setFilterStatus(Status.Active)}
      >
        Active
      </a>

      <a
        href={Status.Completed}
        className={cn('filter__link',
          { selected: filterStatus === Status.Completed })}
        data-cy="FilterLinkCompleted"
        onClick={() => setFilterStatus(Status.Completed)}
      >
        Completed
      </a>
    </nav>
  );
};
