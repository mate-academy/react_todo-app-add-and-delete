import cn from 'classnames';
import { Status } from '../types/StatusEnum';
import React from 'react';

type Props = {
  status: Status;
  onSwitch: (status: Status) => void;
};
export const TodoNavigatoin: React.FC<Props> = ({ status, onSwitch }) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={cn('filter__link', {
          selected: Status.All === status,
        })}
        data-cy="FilterLinkAll"
        onClick={() => onSwitch(Status.All)}
      >
        All
      </a>

      <a
        href="#/active"
        className={cn('filter__link', {
          selected: Status.Active === status,
        })}
        data-cy="FilterLinkActive"
        onClick={() => onSwitch(Status.Active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={cn('filter__link', {
          selected: Status.Completed === status,
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => onSwitch(Status.Completed)}
      >
        Completed
      </a>
    </nav>
  );
};
