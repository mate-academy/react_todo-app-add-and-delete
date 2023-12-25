import React, { FC } from 'react';
import cn from 'classnames';
import { Status } from '../../types/Status';

type Props = {
  filterStatus: Status,
  setFilterStatus: (value: Status) => void,
};

export const TodoFilter: FC<Props> = ({ filterStatus, setFilterStatus }) => {
  const handleChangeStatus = (
    e: React.MouseEvent<HTMLAnchorElement>,
    statusName: Status,
  ): void => {
    e.preventDefault();
    setFilterStatus(statusName);
  };

  return (
    <>
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link',
            { selected: filterStatus === Status.All })}
          data-cy="FilterLinkAll"
          onClick={(e) => handleChangeStatus(e, Status.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link',
            { selected: filterStatus === Status.Active })}
          data-cy="FilterLinkActive"
          onClick={(e) => handleChangeStatus(e, Status.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link',
            { selected: filterStatus === Status.Completed })}
          data-cy="FilterLinkCompleted"
          onClick={(e) => handleChangeStatus(e, Status.Completed)}
        >
          Completed
        </a>
      </nav>
    </>
  );
};
