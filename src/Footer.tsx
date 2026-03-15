import React from 'react';
import classNames from 'classnames';

export type FilterType = 'all' | 'active' | 'completed';

interface Props {
  activeCount: number;
  hasCompleted?: boolean;
  currentFilter?: FilterType;
  onClearCompleted?: () => void;
}

export const Footer: React.FC<Props> = ({
  activeCount,
  hasCompleted = false,
  currentFilter = 'all',
  onClearCompleted = () => {},
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
            selected: currentFilter === 'all',
          })}
          data-cy="FilterLinkAll"
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: currentFilter === 'active',
          })}
          data-cy="FilterLinkActive"
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: currentFilter === 'completed',
          })}
          data-cy="FilterLinkCompleted"
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompleted}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
