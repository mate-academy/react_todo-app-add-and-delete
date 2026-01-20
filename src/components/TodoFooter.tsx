import React from 'react';
import classNames from 'classnames';

import { FilterType, FILTERS } from '../types/filters';

interface Props {
  activeCount: number;
  hasCompleted: boolean;
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  onClearCompleted: () => void;
}

export const TodoFooter: React.FC<Props> = ({
  activeCount,
  hasCompleted,
  currentFilter,
  onFilterChange,
  onClearCompleted,
}) => {
  if (activeCount === 0 && !hasCompleted) {
    return null;
  }

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: currentFilter === FILTERS.all,
          })}
          data-cy="FilterLinkAll"
          onClick={() => onFilterChange(FILTERS.all)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: currentFilter === FILTERS.active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => onFilterChange(FILTERS.active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: currentFilter === FILTERS.completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => onFilterChange(FILTERS.completed)}
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
