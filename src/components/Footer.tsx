import React from 'react';
import { Filter } from '../types/Filter';

type Props = {
  activeCount: number;
  filter: Filter;
  setFilter: (value: Filter) => void;
  hasCompleted: boolean;
  onClearCompleted: () => void;
};

const filters = [
  { label: 'All', value: Filter.All, href: '#/' },
  { label: 'Active', value: Filter.Active, href: '#/active' },
  { label: 'Completed', value: Filter.Completed, href: '#/completed' },
];

export const Footer: React.FC<Props> = ({
  activeCount,
  filter,
  setFilter,
  hasCompleted,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {filters.map(f => (
          <a
            key={f.value}
            href={f.href}
            className={`filter__link ${filter === f.value ? 'selected' : ''}`}
            onClick={e => {
              e.preventDefault();
              setFilter(f.value);
            }}
            data-cy={`FilterLink${f.label}`}
          >
            {f.label}
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
