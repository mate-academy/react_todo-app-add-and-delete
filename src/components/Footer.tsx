import React from 'react';
import classNames from 'classnames';
import { FilterType } from '../types/FilterType';

const FILTERS: { value: FilterType; href: string; label: string; dataCy: string }[] = [
  { value: 'all', href: '#/', label: 'All', dataCy: 'FilterLinkAll' },
  { value: 'active', href: '#/active', label: 'Active', dataCy: 'FilterLinkActive' },
  { value: 'completed', href: '#/completed', label: 'Completed', dataCy: 'FilterLinkCompleted' },
];

type Props = {
  activeTodosCount: number;
  hasCompletedTodos: boolean;
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  onClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  activeTodosCount,
  hasCompletedTodos,
  filter,
  onFilterChange,
  onClearCompleted,
}) => (
  <footer className="todoapp__footer">
    <span className="todo-count" data-cy="TodosCounter">
      {activeTodosCount} {activeTodosCount === 1 ? 'item' : 'items'} left
    </span>

    <nav className="filter" data-cy="Filter">
      {FILTERS.map(({ value, href, label, dataCy }) => (
        <a
          key={value}
          href={href}
          data-cy={dataCy}
          className={classNames('filter__link', { selected: filter === value })}
          onClick={e => {
            e.preventDefault();
            onFilterChange(value);
          }}
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
