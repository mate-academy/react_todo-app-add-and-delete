import React from 'react';
import { Filter } from '../types/Filter';

type Props = {
  filter: Filter;
  activeTodosCount: number;
  hasCompletedTodos: boolean;
  onFilterChange: (filter: Filter) => void;
  onClearCompleted: () => void;
};

const filters = [
  {
    value: Filter.All,
    label: 'All',
    href: '#/',
    dataCy: 'FilterLinkAll',
  },
  {
    value: Filter.Active,
    label: 'Active',
    href: '#/active',
    dataCy: 'FilterLinkActive',
  },
  {
    value: Filter.Completed,
    label: 'Completed',
    href: '#/completed',
    dataCy: 'FilterLinkCompleted',
  },
];

export const TodoFooter: React.FC<Props> = ({
  filter,
  activeTodosCount,
  hasCompletedTodos,
  onFilterChange,
  onClearCompleted,
}) => {
  const handleFilterClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    nextFilter: Filter,
  ) => {
    event.preventDefault();
    onFilterChange(nextFilter);
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {filters.map(currentFilter => (
          <a
            key={currentFilter.value}
            href={currentFilter.href}
            className={`filter__link ${
              filter === currentFilter.value ? 'selected' : ''
            }`}
            data-cy={currentFilter.dataCy}
            onClick={event => handleFilterClick(event, currentFilter.value)}
          >
            {currentFilter.label}
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
