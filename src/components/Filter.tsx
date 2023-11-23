import React from 'react';
import cn from 'classnames';
import { Status } from '../types/filterStatusENUM';

type Props = {
  handleFilterStatus: (status: Status) => void,
  todosFilterStatus: Status,
};

export const TodoFilter: React.FC<Props> = ({
  handleFilterStatus,
  todosFilterStatus,
}) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={cn('filter__link', {
          selected: todosFilterStatus === Status.All,
        })}
        data-cy="FilterLinkAll"
        onClick={(event) => {
          event.preventDefault();
          handleFilterStatus(Status.All);
        }}
      >
        All
      </a>

      <a
        href="#/active"
        className={cn('filter__link', {
          selected: todosFilterStatus === Status.Active,
        })}
        data-cy="FilterLinkActive"
        onClick={(event) => {
          event.preventDefault();
          handleFilterStatus(Status.Active);
        }}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={cn('filter__link', {
          selected: todosFilterStatus === Status.Completed,
        })}
        data-cy="FilterLinkCompleted"
        onClick={(event) => {
          event.preventDefault();
          handleFilterStatus(Status.Completed);
        }}
      >
        Completed
      </a>
    </nav>
  );
};
