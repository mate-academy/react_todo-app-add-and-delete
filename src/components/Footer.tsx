import React from 'react';
import cn from 'classnames';
import { FilterType } from '../types/FilterType';

interface Props {
  filter: FilterType;
  onFilterChange: (newFilter: FilterType) => void;
  activeTodosCount: number;
  completedTodosCount: number;
  onClearCompleted: () => void;
}

export const Footer: React.FC<Props> = ({
  filter,
  onFilterChange,
  activeTodosCount,
  completedTodosCount,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodosCount} ${activeTodosCount === 1 ? 'item' : 'items'} left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(FilterType).map(filterOption => (
          <a
            key={filterOption}
            href={filterOption === FilterType.All ? '#/' : `#/${filterOption}`}
            className={cn('filter__link', {
              selected: filter === filterOption,
            })}
            data-cy={`FilterLink${filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}`}
            onClick={() => onFilterChange(filterOption)}
          >
            {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onClearCompleted}
        disabled={completedTodosCount === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
