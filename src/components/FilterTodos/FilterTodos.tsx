import classNames from 'classnames';
import React from 'react';
import { Status } from '../../types/Status';

type Props = {
  status: Status,
  onStatusChange: (status: Status) => void,
};

export const FilterTodos: React.FC<Props> = ({
  status,
  onStatusChange,
}) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        data-cy="FilterLinkAll"
        href="#/"
        className={
          classNames('filter__link', {
            selected: status === Status.ALL,
          })
        }
        onClick={() => onStatusChange(Status.ALL)}
      >
        {Status.ALL}
      </a>

      <a
        data-cy="FilterLinkActive"
        href="#/active"
        className={
          classNames('filter__link', {
            selected: status === Status.ACTIVE,
          })
        }
        onClick={() => onStatusChange(Status.ACTIVE)}
      >
        {Status.ACTIVE}
      </a>
      <a
        data-cy="FilterLinkCompleted"
        href="#/completed"
        className={
          classNames('filter__link', {
            selected: status === Status.COMPLETED,
          })
        }
        onClick={() => onStatusChange(Status.COMPLETED)}
      >
        {Status.COMPLETED}
      </a>
    </nav>
  );
};
