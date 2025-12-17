import classNames from 'classnames';
import './Footer.scss';
import { StatusTypes } from '../../enums/StatusTypes';
import React from 'react';

type Props = {
  todosCount: number;
  statusFilter: StatusTypes;
  onStatusFilter: (statusFilter: StatusTypes) => void;
};

export const Footer: React.FC<Props> = ({
  todosCount,
  statusFilter,
  onStatusFilter,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosCount} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: statusFilter === StatusTypes.ALL,
          })}
          data-cy="FilterLinkAll"
          onClick={() => onStatusFilter(StatusTypes.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: statusFilter === 'active',
          })}
          data-cy="FilterLinkActive"
          onClick={() => onStatusFilter(StatusTypes.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: statusFilter === 'completed',
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => onStatusFilter(StatusTypes.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
      >
        Clear completed
      </button>
    </footer>
  );
};
