import React from 'react';
import { FilterStatus } from '../types/enums';

interface FilterLink {
  href: string;
  value: FilterStatus;
  label: string;
  dataCy: string;
}

interface TodoFooterProps {
  hasTodos: boolean;
  filterBy: FilterStatus;
  activeTodosCount: number;
  onFilterChange: (filter: FilterStatus) => void;
  onClearCompleted: () => void;
  hasCompletedTodos: boolean;
}

const FILTER_LINKS: FilterLink[] = [
  {
    href: '#/',
    value: FilterStatus.All,
    label: 'All',
    dataCy: 'FilterLinkAll',
  },
  {
    href: '#/active',
    value: FilterStatus.Active,
    label: 'Active',
    dataCy: 'FilterLinkActive',
  },
  {
    href: '#/completed',
    value: FilterStatus.Completed,
    label: 'Completed',
    dataCy: 'FilterLinkCompleted',
  },
];

export const TodoFooter: React.FC<TodoFooterProps> = ({
  hasTodos,
  filterBy,
  activeTodosCount,
  onFilterChange,
  onClearCompleted,
  hasCompletedTodos,
}) => {
  if (!hasTodos) {
    return null;
  }

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {FILTER_LINKS.map(link => (
          <a
            key={link.value}
            href={link.href}
            className={
              filterBy === link.value ? 'filter__link selected' : 'filter__link'
            }
            data-cy={link.dataCy}
            onClick={() => onFilterChange(link.value)}
          >
            {link.label}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onClearCompleted}
        disabled={!hasCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
