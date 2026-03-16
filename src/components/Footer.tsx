import React from 'react';
import { FilterType } from '../types/Todo';

interface FooterProps {
  activeTodosCount: number;
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  completedTodosCount: number;
  handleClearCompleted: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  activeTodosCount,
  filter,
  setFilter,
  completedTodosCount,
  handleClearCompleted,
}) => {
  const filters: FilterType[] = [
    FilterType.All,
    FilterType.Active,
    FilterType.Completed,
  ];

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} {activeTodosCount === 1 ? 'item' : 'items'} left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {filters.map(filterType => (
          <a
            key={filterType}
            href={`#/${filterType.toLowerCase()}`}
            className={`filter__link ${filter === filterType ? 'selected' : ''}`}
            data-cy={`FilterLink${filterType}`}
            onClick={() => setFilter(filterType)}
          >
            {filterType}
          </a>
        ))}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodosCount === 0}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
