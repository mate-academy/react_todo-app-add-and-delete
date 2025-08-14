import React from 'react';
import classNames from 'classnames';
import { FilterStatus } from '../types/FilterStatus';

interface Props {
  activeCount: number;
  completedCount: number;
  filterBy: FilterStatus;
  onFilterBy: (filter: FilterStatus) => void;
  onClearCompleted: () => void;
}

export const Footer: React.FC<Props> = ({
  activeCount,
  completedCount,
  filterBy,
  onFilterBy,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames({ selected: filterBy === FilterStatus.ALL })}
          data-cy="FilterLinkAll"
          onClick={() => onFilterBy(FilterStatus.ALL)}
        >
          All
        </a>
        <a
          href="#/active"
          className={classNames({ selected: filterBy === FilterStatus.ACTIVE })}
          data-cy="FilterLinkActive"
          onClick={() => onFilterBy(FilterStatus.ACTIVE)}
        >
          Active
        </a>
        <a
          href="#/completed"
          className={classNames({
            selected: filterBy === FilterStatus.COMPLETED,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => onFilterBy(FilterStatus.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onClearCompleted}
        disabled={completedCount === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
