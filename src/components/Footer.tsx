import React from 'react';
import cn from 'classnames';
import { FilterStatus } from '../types/FilterStatus';

type Props = {
  activeTodosCount: number;
  filter: FilterStatus;
  setFilter: (status: FilterStatus) => void;
  hasCompleted: boolean;
  onClearCompleted: () => void;
};

const filterLinks = [
  { status: FilterStatus.All, label: 'All', href: '#/', cy: 'FilterLinkAll' },

  {
    status: FilterStatus.Active,
    label: 'Active',
    href: '#/active',
    cy: 'FilterLinkActive',
  },
  {
    status: FilterStatus.Completed,
    label: 'Completed',
    href: '#/completed',
    cy: 'FilterLinkCompleted',
  },
];

export const Footer: React.FC<Props> = ({
  activeTodosCount,
  filter,
  setFilter,
  hasCompleted,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {filterLinks.map(({ status, label, href, cy }) => (
          <a
            key={status}
            href={href}
            className={cn('filter__link', {
              selected: filter === status,
            })}
            onClick={() => setFilter(status)}
            data-cy={cy}
          >
            {label}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onClearCompleted}
        disabled={!hasCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
