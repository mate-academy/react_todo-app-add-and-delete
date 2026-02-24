/**
 * Component for the todo application footer, containing the item counter and status filters
 */
import React from 'react';
import cn from 'classnames';
import { FilterStatus } from '../types/FilterStatus';

type Props = {
  activeTodosCount: number;
  filterStatus: FilterStatus;
  hasCompletedTodos: boolean;
  onFilterChange: (status: FilterStatus) => void;
  onClearCompleted: () => void;
};

export const TodoFooter: React.FC<Props> = ({
  activeTodosCount,
  filterStatus,
  hasCompletedTodos,
  onFilterChange,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodosCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {/* Generate filter links dynamically from the FilterStatus enum */}
        {Object.values(FilterStatus).map(status => (
          <a
            key={status}
            href={`#/${status === FilterStatus.All ? '' : status}`}
            className={cn('filter__link', {
              selected: filterStatus === status,
            })}
            data-cy={`FilterLink${status[0].toUpperCase() + status.slice(1)}`}
            onClick={() => onFilterChange(status)}
          >
            {status[0].toUpperCase() + status.slice(1)}
          </a>
        ))}
      </nav>

      {/* Button to remove all completed todos - disabled if none are completed */}
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
