import React from 'react';
import classNames from 'classnames';
import { FilterStatus } from '../types/FilterStatus';

type Props = {
  activeCount: number;
  completedCount: number;
  filter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
  onClearCompleted: () => void;
};

const filterOptions = [
  { status: FilterStatus.All, label: 'All', href: '#/', cy: 'FilterLinkAll' },
  { status: FilterStatus.Active, label: 'Active', href: '#/active', cy: 'FilterLinkActive' },
  { status: FilterStatus.Completed, label: 'Completed', href: '#/completed', cy: 'FilterLinkCompleted' },
];

export const Footer: React.FC<Props> = ({
  activeCount,
  completedCount,
  filter,
  onFilterChange,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {filterOptions.map(({ status, label, href, cy }) => (
          <a
            key={status}
            href={href}
            className={classNames('filter__link', {
              selected: filter === status,
            })}
            data-cy={cy}
            onClick={() => onFilterChange(status)}
          >
            {label}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedCount === 0}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
