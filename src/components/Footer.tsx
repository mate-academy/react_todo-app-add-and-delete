import React from 'react';
import classNames from 'classnames';
import { StatusFilter } from '../types/StatusFilter';

type Props = {
  statusFilter: StatusFilter;
  onFilterChange: (filter: StatusFilter) => void;
  activeCount: number;
  completedCount: number;
  onClearCompleted: () => void;
};

const filterLabels: Record<StatusFilter, string> = {
  [StatusFilter.All]: 'All',
  [StatusFilter.Active]: 'Active',
  [StatusFilter.Completed]: 'Completed',
};

export const Footer: React.FC<Props> = ({
  statusFilter,
  onFilterChange,
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
        {Object.values(StatusFilter).map(filter => (
          <a
            key={filter}
            href={`#/${filter}`}
            className={classNames('filter__link', {
              selected: statusFilter === filter,
            })}
            data-cy={`FilterLink${filter.charAt(0).toUpperCase() + filter.slice(1)}`}
            onClick={() => onFilterChange(filter)}
          >
            {filterLabels[filter]}
          </a>
        ))}
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
