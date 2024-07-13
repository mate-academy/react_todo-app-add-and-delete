import React from 'react';
import classNames from 'classnames';
import { Status } from '../separate/Status';

export type Props = {
  filter: Status;
  setFilter: (filter: Status) => void;
  activeCount: number;
  completedCount: number;
  onClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  filter,
  setFilter,
  activeCount,
  completedCount,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeCount} items left
      </span>
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filter === Status.all,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilter(Status.all)}
        >
          All
        </a>
        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filter === Status.active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilter(Status.active)}
        >
          Active
        </a>
        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filter === Status.completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter(Status.completed)}
        >
          Completed
        </a>
      </nav>

      {completedCount > 0 && (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={onClearCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
