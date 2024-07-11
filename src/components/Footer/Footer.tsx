/* eslint-disable import/no-extraneous-dependencies */
import { FC } from 'react';
import cn from 'classnames';
import pluralize from 'pluralize';

import { Status } from '../../types/statusTypes';
import React from 'react';

interface Props {
  activeTodosCount: number;
  selectedStatus: Status;
  setSelectedStatus: (status: Status) => void;
  deleteAllCompleted: () => void;
  clearAllVisible: boolean;
}

export const Footer: FC<Props> = ({
  activeTodosCount,
  selectedStatus,
  setSelectedStatus,
  deleteAllCompleted,
  clearAllVisible,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodosCount} ${pluralize('item', activeTodosCount)} left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', { selected: selectedStatus === 'all' })}
          data-cy="FilterLinkAll"
          onClick={() => setSelectedStatus(Status.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: selectedStatus === 'active',
          })}
          data-cy="FilterLinkActive"
          onClick={() => setSelectedStatus(Status.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: selectedStatus === 'completed',
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setSelectedStatus(Status.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={deleteAllCompleted}
        disabled={!clearAllVisible}
      >
        Clear completed
      </button>
    </footer>
  );
};
