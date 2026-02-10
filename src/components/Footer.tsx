import React from 'react';

enum Filter {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

const FILTERS = [
  { value: Filter.All, label: 'All', href: '#/' },
  { value: Filter.Active, label: 'Active', href: '#/active' },
  { value: Filter.Completed, label: 'Completed', href: '#/completed' },
];

interface Props {
  filter: Filter;
  activeTodosCount: number;
  completedTodosCount: number;
  onFilterChange: (filter: Filter) => void;
  onClearCompleted: () => void;
}

export const Footer: React.FC<Props> = ({
  filter,
  activeTodosCount,
  completedTodosCount,
  onFilterChange,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>
      <nav className="filter" data-cy="Filter">
        {FILTERS.map(({ value, label, href }) => (
          <a
            key={value}
            href={href}
            className={`filter__link ${filter === value ? 'selected' : ''}`}
            data-cy={
              value === Filter.All
                ? 'FilterLinkAll'
                : value === Filter.Active
                  ? 'FilterLinkActive'
                  : 'FilterLinkCompleted'
            }
            onClick={() => onFilterChange(value)}
          >
            {label}
          </a>
        ))}
      </nav>

      {/* {completedTodosCount > 0 && ( */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onClearCompleted}
        disabled={completedTodosCount === 0}
      >
        Clear completed
      </button>
      {/* )} */}
    </footer>
  );
};

export { Filter };
