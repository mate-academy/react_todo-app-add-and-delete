import React from 'react';
import cn from 'classnames';

import { FilterTypes } from '../types/FilterTypes';

const filterOptions = [
  {
    value: FilterTypes.ALL,
    label: 'All',
    href: '#/',
    dataCy: 'FilterLinkAll',
  },
  {
    value: FilterTypes.ACTIVE,
    label: 'Active',
    href: '#/active',
    dataCy: 'FilterLinkActive',
  },
  {
    value: FilterTypes.COMPLETED,
    label: 'Completed',
    href: '#/completed',
    dataCy: 'FilterLinkCompleted',
  },
];

type FooterProps = {
  activeTodosCount: number;
  filterType: FilterTypes;
  onFilterChange: (filterType: FilterTypes) => void;
  hasCompletedTodos: boolean;
  onClearCompleted: () => void;
};

export const TodosFooter: React.FC<FooterProps> = ({
  activeTodosCount,
  filterType,
  onFilterChange,
  hasCompletedTodos,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount}
        {` ${activeTodosCount === 1 ? 'item' : 'items'} left`}
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {filterOptions.map(option => (
          <a
            href={option.href}
            className={cn('filter__link', {
              selected: filterType === option.value,
            })}
            data-cy={option.dataCy}
            onClick={() => onFilterChange(option.value)}
            key={option.value}
          >
            {option.label}
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
