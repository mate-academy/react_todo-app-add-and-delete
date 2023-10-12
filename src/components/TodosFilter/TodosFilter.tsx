import React from 'react';
import cn from 'classnames';
import { Status } from '../../types/Status';

type Props = {
  setTodosStatus: (s: Status) => void,
  todosStatus: Status,
};

export const Filter: React.FC<Props> = ({ setTodosStatus, todosStatus }) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={cn('filter__link', {
          selected: todosStatus === Status.All,
        })}
        data-cy="FilterLinkAll"
        onClick={() => setTodosStatus(Status.All)}
      >
        {Status.All}
      </a>

      <a
        href="#/active"
        className={cn('filter__link', {
          selected: todosStatus === Status.Active,
        })}
        data-cy="FilterLinkActive"
        onClick={() => setTodosStatus(Status.Active)}
      >
        {Status.Active}
      </a>

      <a
        href="#/completed"
        className={cn('filter__link', {
          selected: todosStatus === Status.Completed,
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => setTodosStatus(Status.Completed)}
      >
        {Status.Completed}
      </a>
    </nav>
  );
};
