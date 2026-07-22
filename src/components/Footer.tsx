import React from 'react';
import cn from 'classnames';
import { FilterStatus } from '../types/FilterStatus';

interface Props {
  activeTodosCount: number;
  hasCompletedTodos: boolean;
  filterBy: FilterStatus;
  setFilterBy: (filter: FilterStatus) => void;
  onClearCompleted: () => void;
}

const FILTER_LINKS = [
  {
    type: FilterStatus.All,
    href: '#/',
    label: 'All',
    dataCy: 'FilterLinkAll',
  },
  {
    type: FilterStatus.Active,
    href: '#/active',
    label: 'Active',
    dataCy: 'FilterLinkActive',
  },
  {
    type: FilterStatus.Completed,
    href: '#/completed',
    label: 'Completed',
    dataCy: 'FilterLinkCompleted',
  },
];

export const Footer: React.FC<Props> = ({
  activeTodosCount,
  hasCompletedTodos,
  filterBy,
  setFilterBy,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {FILTER_LINKS.map(({ type, href, label, dataCy }) => (
          <a
            key={type}
            href={href}
            className={cn('filter__link', {
              selected: filterBy === type,
            })}
            data-cy={dataCy}
            onClick={() => setFilterBy(type)}
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
};
