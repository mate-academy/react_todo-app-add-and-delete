import React from 'react';
import { FilterStatus } from '../types/FilterStatus';

const FILTER_LINKS = [
  {
    status: FilterStatus.All,
    label: 'All',
    href: '#/',
    dataCy: 'FilterLinkAll',
  },
  {
    status: FilterStatus.Active,
    label: 'Active',
    href: '#/active',
    dataCy: 'FilterLinkActive',
  },
  {
    status: FilterStatus.Completed,
    label: 'Completed',
    href: '#/completed',
    dataCy: 'FilterLinkCompleted',
  },
];

type Props = {
  filter: FilterStatus;
  onFilterChange: (status: FilterStatus) => void;
  activeTodosCount: number;
  hasCompletedTodos: boolean;
  onClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  filter,
  onFilterChange,
  activeTodosCount,
  hasCompletedTodos,
  onClearCompleted,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="TodosCounter">
      {activeTodosCount} items left
    </span>

    <nav className="filter" data-cy="Filter">
      {FILTER_LINKS.map(({ status, label, href, dataCy }) => (
        <a
          key={status}
          href={href}
          className={`filter__link ${filter === status ? 'selected' : ''}`}
          data-cy={dataCy}
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
      disabled={!hasCompletedTodos}
      onClick={onClearCompleted}
    >
      Clear completed
    </button>
  </footer>
);