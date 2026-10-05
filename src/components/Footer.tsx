import React from 'react';
import { FilterStatus } from '../types/Filter';

interface Props {
  activeCount: number;
  filter: FilterStatus;
  setFilter: (filter: FilterStatus) => void;
  hasCompleted: boolean;
  onClearCompleted: () => void;
}

export const Footer: React.FC<Props> = ({
  activeCount,
  filter,
  setFilter,
  hasCompleted,
  onClearCompleted,
}) => {
  const filterLinks = [
    { label: 'All', status: FilterStatus.All, href: '#/' },
    { label: 'Active', status: FilterStatus.Active, href: '#/active' },
    { label: 'Completed', status: FilterStatus.Completed, href: '#/completed' },
  ];

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {filterLinks.map(({ label, status, href }) => (
          <a
            key={status}
            href={href}
            className={`filter__link ${filter === status ? 'selected' : ''}`}
            data-cy={`FilterLink${label}`}
            onClick={() => setFilter(status)}
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
