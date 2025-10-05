import React from 'react';
import { Filter } from './types/Todo';

type Props = {
  activeTodosCount: number;
  currentFilter: Filter;
  onFilterChange: (filter: Filter) => void;
  onClearCompleted: () => Promise<void>;
  hasCompletedTodos: boolean;
};

export const Footer: React.FC<Props> = ({
  activeTodosCount,
  currentFilter,
  onFilterChange,
  onClearCompleted,
  hasCompletedTodos,
}) => {
  const filters: Filter[] = ['All', 'Active', 'Completed'];

  const handleClearCompleted = () => {
    onClearCompleted();
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} item{activeTodosCount !== 1 ? 's' : ''} left
      </span>

      <nav className="filter" data-cy="Filter">
        {filters.map(filterName => (
          <a
            key={filterName}
            href={`#/${filterName.toLowerCase()}`}
            className={`filter__link ${currentFilter === filterName ? 'selected' : ''}`}
            data-cy={`FilterLink${filterName}`}
            onClick={() => onFilterChange(filterName)}
          >
            {filterName}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleClearCompleted}
        disabled={!hasCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
