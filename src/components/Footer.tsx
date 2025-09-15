import React from 'react';
import { Filter } from '../types/Filter';

type Props = {
  itemsLeft: number;
  hasCompleted: boolean;
  onFilterChange: (filter: Filter) => void;
  currentFilter: Filter;
  onClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  itemsLeft,
  hasCompleted,
  currentFilter,
  onFilterChange,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${itemsLeft} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(Filter).map(filterValue => (
          <a
            key={filterValue}
            href={`#/${filterValue === Filter.All ? '' : filterValue}`}
            className={`filter__link ${
              currentFilter === filterValue ? 'selected' : ''
            }`}
            onClick={() => onFilterChange(filterValue)}
            data-cy={`FilterLink${filterValue[0].toUpperCase()}${filterValue.slice(1)}`}
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
