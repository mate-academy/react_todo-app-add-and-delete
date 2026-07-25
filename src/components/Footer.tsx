import React from 'react';
import { FilterType } from '../types/Todo';

const FILTERS = [
  { type: FilterType.All, label: 'All', href: '#/', cy: 'FilterLinkAll' },
  {
    type: FilterType.Active,
    label: 'Active',
    href: '#/active',
    cy: 'FilterLinkActive',
  },
  {
    type: FilterType.Completed,
    label: 'Completed',
    href: '#/completed',
    cy: 'FilterLinkCompleted',
  },
];

interface Props {
  activeTodosCount: number;
  hasCompleted: boolean;
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  onClearCompleted: () => void;
}

export const Footer: React.FC<Props> = ({
  activeTodosCount,
  hasCompleted,
  filter,
  onFilterChange,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodosCount} item${activeTodosCount === 1 ? '' : 's'} left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {FILTERS.map(({ type, label, href, cy }) => (
          <a
            key={type}
            href={href}
            className={`filter__link ${filter === type ? 'selected' : ''}`}
            data-cy={cy}
            onClick={() => onFilterChange(type)}
          >
            {label}
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
