import React from 'react';
import { FilterStatus } from '../../types/FilterStatus';
import cn from 'classnames';

type Props = {
  filter: string;
  activeCount: number;
  hasCompleted: boolean;
  onFilterChange: (status: FilterStatus) => void;
  onClear: () => void;
};

export const Footer: React.FC<Props> = ({
  filter,
  activeCount,
  hasCompleted,
  onFilterChange,
  onClear,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeCount} items left
      </span>

      {
        <nav className="filter" data-cy="Filter">
          {[FilterStatus.All, FilterStatus.Active, FilterStatus.Completed].map(
            status => (
              <a
                key={status}
                href={`#/${status !== FilterStatus.All ? status.toLowerCase() : ''}`}
                className={cn('filter__link', { selected: filter === status })}
                onClick={() => onFilterChange(status)}
                data-cy={`FilterLink${status}`}
              >
                {status}
              </a>
            ),
          )}
        </nav>
      }
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onClear}
        disabled={!hasCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
