import React from 'react';
import classNames from 'classnames';
import { Status } from '../types/Status';

interface Props {
  activeCount: number;
  filterStatus: Status;
  hasCompletedTodos: boolean;
  onFilterChange: (status: Status) => void;
  onClearCompleted: () => void;
}

export const Footer: React.FC<Props> = ({
  activeCount,
  filterStatus,
  hasCompletedTodos,
  onFilterChange,
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
            selected: filterStatus === Status.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => onFilterChange(Status.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filterStatus === Status.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => onFilterChange(Status.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filterStatus === Status.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => onFilterChange(Status.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompletedTodos}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
