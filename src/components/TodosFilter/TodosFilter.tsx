import React from 'react';
import classNames from 'classnames';
import { Status } from '../../types/Status';

interface Props {
  status: Status,
  onStatusChange: (s: Status) => void,
}

export const TodosFilter: React.FC<Props> = ({ status, onStatusChange }) => (
  <nav className="filter" data-cy="Filter">
    <a
      href="#/"
      className={classNames('filter__link', {
        selected: status === Status.ALL,
      })}
      data-cy="FilterLinkAll"
      onClick={() => {
        onStatusChange(Status.ALL);
      }}
    >
      All
    </a>

    <a
      href="#/active"
      className={classNames('filter__link', {
        selected: status === Status.ACTIVE,
      })}
      data-cy="FilterLinkActive"
      onClick={() => {
        onStatusChange(Status.ACTIVE);
      }}
    >
      Active
    </a>

    <a
      href="#/completed"
      className={classNames('filter__link', {
        selected: status === Status.COMPLETED,
      })}
      data-cy="FilterLinkCompleted"
      onClick={() => {
        onStatusChange(Status.COMPLETED);
      }}
    >
      Completed
    </a>
  </nav>
);
