import React from 'react';
import '../../styles/todoapp.scss';
import { FilterStatus } from '../../Types/Types';

type Props = {
  activeCount: number;
  hasCompleted: boolean;
  filterStatus: FilterStatus;
  onFilterChange: (status: FilterStatus) => void;
  onClearCompleted: () => void;
};

export const TodoFooter: React.FC<Props> = ({
  activeCount,
  hasCompleted,
  filterStatus,
  onFilterChange,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(FilterStatus).map(status => (
          <a
            key={status}
            href={`#/${status === 'all' ? '' : status}`}
            className={`filter__link ${filterStatus === status ? 'selected' : ''}`}
            data-cy={`FilterLink${status.charAt(0).toUpperCase() + status.slice(1)}`}
            onClick={() => {
              onFilterChange(status);
            }}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
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
