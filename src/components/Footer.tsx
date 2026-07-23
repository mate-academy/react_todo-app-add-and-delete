import React from 'react';
import classNames from 'classnames';
import { FilterStatus } from '../types/FilterStatus';

type Props = {
  activeCount: number;
  completedCount: number;
  filter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
  onClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  activeCount,
  completedCount,
  filter,
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
            selected: filter === FilterStatus.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => onFilterChange(FilterStatus.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filter === FilterStatus.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => onFilterChange(FilterStatus.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filter === FilterStatus.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => onFilterChange(FilterStatus.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedCount === 0}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
