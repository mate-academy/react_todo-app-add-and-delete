import React from 'react';
import classnames from 'classnames';
import { TodoStatus } from '../types/TodoStatus';

type Props = {
  changeStatus: React.Dispatch<React.SetStateAction<TodoStatus>>,
  status: string,
};

export const Navigation: React.FC<Props> = ({ changeStatus, status }) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        data-cy="FilterLinkAll"
        href="#/"
        className={classnames({
          filter__link: true,
          selected: status === 'All',
        })}
        onClick={() => {
          changeStatus(TodoStatus.All);
        }}
      >
        All
      </a>

      <a
        data-cy="FilterLinkActive"
        href="#/active"
        className={classnames({
          filter__link: true,
          selected: status === 'Active',
        })}
        onClick={() => {
          changeStatus(TodoStatus.Active);
        }}
      >
        Active
      </a>
      <a
        data-cy="FilterLinkCompleted"
        href="#/completed"
        className={classnames({
          filter__link: true,
          selected: status === 'Completed',
        })}
        onClick={() => {
          changeStatus(TodoStatus.Completed);
        }}
      >
        Completed
      </a>

    </nav>
  );
};
