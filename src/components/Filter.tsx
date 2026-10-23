import React from 'react';
import classnames from 'classnames';
import { FILTERS, Status } from '../constants/todo';

interface FilterProps {
  status: Status;
  onStatusChange: (status: Status) => void;
}

export const Filter: React.FC<FilterProps> = ({ status, onStatusChange }) => (
  <nav className="filter" data-cy="Filter">
    <a
      href="#/"
      className={classnames('filter__link', {
        selected: status === FILTERS.all,
      })}
      data-cy="FilterLinkAll"
      onClick={() => onStatusChange(FILTERS.all)}
    >
      All
    </a>

    <a
      href="#/active"
      className={classnames('filter__link', {
        selected: status === FILTERS.active,
      })}
      data-cy="FilterLinkActive"
      onClick={() => onStatusChange(FILTERS.active)}
    >
      Active
    </a>

    <a
      href="#/completed"
      className={classnames('filter__link', {
        selected: status === FILTERS.completed,
      })}
      data-cy="FilterLinkCompleted"
      onClick={() => onStatusChange(FILTERS.completed)}
    >
      Completed
    </a>
  </nav>
);
