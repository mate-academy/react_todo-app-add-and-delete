import React from 'react';
import { FilterStatus } from '../types/FilterStatus';
import classNames from 'classnames';

type Props = {
  activeCount: number;
  filters: FilterStatus[];
  status: FilterStatus;
  setStatus: (status: FilterStatus) => void;
  completedCount: boolean;
  onClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  activeCount,
  filters,
  status,
  setStatus,
  completedCount,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeCount} items left`}
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {filters.map(filter => (
          <a
            key={filter}
            href={`#/${filter === FilterStatus.All ? '' : filter.toLowerCase()}`}
            className={classNames('filter__link', {
              selected: status === filter,
            })}
            data-cy={`FilterLink${filter}`}
            onClick={() => setStatus(filter)}
          >
            {filter}
          </a>
        ))}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!completedCount}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
