import React from 'react';
import { FilterStatus } from '../types/Filter';
import cn from 'classnames';

const filters = [
  { status: FilterStatus.All, title: 'All', href: '#/' },
  { status: FilterStatus.Active, title: 'Active', href: '#/active' },
  { status: FilterStatus.Completed, title: 'Completed', href: '#/completed' },
];

export interface Props {
  filter: FilterStatus;
  todoCount: number;
  hasCompleted: boolean;
  onFilterChange: (newFilter: FilterStatus) => void;
  onClearCompleted: () => void;
}

export const Footer: React.FC<Props> = ({
  filter,
  todoCount,
  hasCompleted,
  onFilterChange,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todoCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {filters.map(({ status, title, href }) => (
          <a
            key={status}
            href={href}
            className={cn('filter__link', {
              selected: filter === status,
            })}
            data-cy={`FilterLink${title}`}
            onClick={() => onFilterChange(status)}
          >
            {title}
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
