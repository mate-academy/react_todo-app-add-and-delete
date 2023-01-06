import classNames from 'classnames';
import React from 'react';
import { FilterStatus } from '../types/FilterStatus';

type Props = {
  hasCompleted: boolean;
  activeCount: number;
  onFilterChange: (value: FilterStatus) => void;
  filter: FilterStatus;
  onClearCompleted: () => void
};

export const Footer: React.FC<Props> = ({
  hasCompleted,
  activeCount,
  onFilterChange,
  filter,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.entries(FilterStatus).map(([key, value]) => (
          <a
            data-cy={`FilterLink${key}`}
            href={`#/${value}`}
            className={classNames(
              'filter__link',
              { selected: value === filter },
            )}
            key={value}
            onClick={() => onFilterChange(value)}
          >
            {key}
          </a>
        ))}
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        disabled={!hasCompleted}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
