import React from 'react';

export type Filter = 'all' | 'active' | 'completed';

interface FooterProps {
  activeTodosCount: number;
  hasCompletedTodos: boolean;
  filter: Filter;
  onFilterChange: (filter: Filter) => void;
  onClearCompleted: () => void;
}

const FILTERS: Record<Filter, Filter> = {
  all: 'all',
  active: 'active',
  completed: 'completed',
};

export const Footer: React.FC<FooterProps> = ({
  activeTodosCount,
  hasCompletedTodos,
  filter,
  onFilterChange,
  onClearCompleted,
}) => {
  const handleFilterChange = (
    event: React.MouseEvent<HTMLAnchorElement>,
    newFilter: Filter,
  ): void => {
    event.preventDefault();
    onFilterChange(newFilter);
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      {/* prettier-ignore */}
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount}{' '}
        {activeTodosCount === 1 ? 'item' : 'items'} left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={`filter__link ${filter === FILTERS.all ? 'selected' : ''}`}
          data-cy="FilterLinkAll"
          onClick={event => handleFilterChange(event, FILTERS.all)}
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link ${
            filter === FILTERS.active ? 'selected' : ''
          }`}
          data-cy="FilterLinkActive"
          onClick={event => handleFilterChange(event, FILTERS.active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link ${
            filter === FILTERS.completed ? 'selected' : ''
          }`}
          data-cy="FilterLinkCompleted"
          onClick={event => handleFilterChange(event, FILTERS.completed)}
        >
          Completed
        </a>
      </nav>

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
