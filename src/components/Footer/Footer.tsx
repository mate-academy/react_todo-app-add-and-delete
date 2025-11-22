import React from 'react';
import classNames from 'classnames';
import { FilterStatus } from '../../types/FilterStatus';

interface FooterProps {
  activeCount: number;
  filterStatus: FilterStatus;
  setFilterStatus: React.Dispatch<React.SetStateAction<FilterStatus>>;
  hasCompleted: boolean;
  onClearCompleted: () => Promise<void>;
}

export const Footer: React.FC<FooterProps> = ({
  activeCount,
  filterStatus,
  setFilterStatus,
  hasCompleted,
  onClearCompleted,
}) => {
  const filterOptions = Object.values(FilterStatus);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {filterOptions.map(status => (
          <a
            key={status}
            href={`#/${status.toLowerCase()}`}
            className={classNames('filter__link', {
              selected: filterStatus === status,
            })}
            data-cy={`FilterLink${status}`}
            onClick={() => setFilterStatus(status)}
          >
            {status}
          </a>
        ))}
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
