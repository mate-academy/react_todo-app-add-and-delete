import React from 'react';
import { Filters } from '../../types/Filters';
import { FilterStatus } from '../../types/FilterStatus';

type Props = {
  activeTodosCount: number;
  filters: Filters[];
  filter: FilterStatus;
  setFilter: (value: FilterStatus) => void;
  hasCompleted: boolean;
  deleteCompletedTodo: () => void;
};

export const Footer: React.FC<Props> = ({
  activeTodosCount,
  filters,
  filter,
  setFilter,
  hasCompleted,
  deleteCompletedTodo,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="TodosCounter">
      {`${activeTodosCount} ${activeTodosCount === 1 ? 'item' : 'items'} left`}
    </span>

    <nav className="filter" data-cy="Filter">
      {filters.map(({ value, label, href, cy }) => (
        <a
          key={value}
          href={href}
          data-cy={cy}
          className={`filtered__link ${filter === value ? 'selected' : ''}`}
          onClick={() => setFilter(value)}
        >
          {label}
        </a>
      ))}
    </nav>

    <button
      type="button"
      className="todoapp__clear-completed"
      data-cy="ClearCompletedButton"
      disabled={!hasCompleted}
      onClick={deleteCompletedTodo}
    >
      Clear completed
    </button>
  </footer>
);
