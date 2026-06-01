import React from 'react';
import classNames from 'classnames';
import { FilterType } from '../types/Todo';

type Props = {
  activeCount: number;
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  hasCompleted: boolean;
  onClearCompleted: () => void;
};

export const TodoFilter: React.FC<Props> = ({
  activeCount,
  currentFilter,
  onFilterChange,
  hasCompleted,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(FilterType).map(filterValue => (
          <a
            key={filterValue}
            href={`#/${filterValue === FilterType.All ? '' : filterValue}`}
            className={classNames('filter__link', {
              selected: currentFilter === filterValue,
            })}
            data-cy={`FilterLink${filterValue.charAt(0).toUpperCase() + filterValue.slice(1)}`}
            onClick={() => onFilterChange(filterValue)}
          >
            {filterValue.charAt(0).toUpperCase() + filterValue.slice(1)}
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
