import React from 'react';
import cn from 'classnames';

export enum FilterStatus {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

interface Props {
  filter: FilterStatus;
  setFilter: (filter: FilterStatus) => void;
  activeCount: number;
  onClearCompleted: () => void;
  hasCompleted: boolean;
}

export const Footer: React.FC<Props> = ({
  filter,
  setFilter,
  activeCount,
  onClearCompleted,
  hasCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: filter === FilterStatus.All,
          })}
          onClick={() => setFilter(FilterStatus.All)}
          data-cy="FilterLinkAll"
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filter === FilterStatus.Active,
          })}
          onClick={() => setFilter(FilterStatus.Active)}
          data-cy="FilterLinkActive"
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filter === FilterStatus.Completed,
          })}
          onClick={() => setFilter(FilterStatus.Completed)}
          data-cy="FilterLinkCompleted"
        >
          Completed
        </a>
      </nav>
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onClearCompleted}
        disabled={!hasCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
