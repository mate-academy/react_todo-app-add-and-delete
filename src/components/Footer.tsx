import React from 'react';
import cn from 'classnames';
import { Filter } from '../types/Filter';

type Props = {
  activeCount: number;
  completedCount: number;
  filter: Filter;
  setFilter: (x: Filter) => void;
  onClearCompleted: () => void;
};

const FILTER_OPTIONS = [
  { key: Filter.All, label: 'All', href: '#/all' },
  { key: Filter.Active, label: 'Active', href: '#/active' },
  { key: Filter.Completed, label: 'Completed', href: '#/completed' },
];

export const Footer: React.FC<Props> = ({
  activeCount,
  completedCount,
  filter,
  setFilter,
  onClearCompleted,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="TodosCounter">
      {activeCount} items left
    </span>

    <nav className="filter" data-cy="Filter">
      {FILTER_OPTIONS.map(({ key, label, href }) => (
        <a
          key={key}
          href={href}
          className={cn('filter__link', { selected: filter === key })}
          data-cy={`FilterLink${label}`}
          onClick={() => setFilter(key)}
        >
          {label}
        </a>
      ))}
    </nav>

    <button
      type="button"
      className="todoapp__clear-completed"
      data-cy="ClearCompletedButton"
      disabled={!completedCount}
      onClick={onClearCompleted}
    >
      Clear completed
    </button>
  </footer>
);
