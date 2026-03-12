import React from 'react';
import classNames from 'classnames';

enum FilterStatus {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

interface TodoFooterProps {
  activeTodosCount: number;
  completedTodosCount: number;
  filterStatus: FilterStatus;
  onFilterChange: (status: FilterStatus) => void;
  onClearCompleted: () => void;
}

const FILTERS = [
  {
    status: FilterStatus.All,
    href: '#/',
    label: 'All',
    dataCy: 'FilterLinkAll',
  },
  {
    status: FilterStatus.Active,
    href: '#/active',
    label: 'Active',
    dataCy: 'FilterLinkActive',
  },
  {
    status: FilterStatus.Completed,
    href: '#/completed',
    label: 'Completed',
    dataCy: 'FilterLinkCompleted',
  },
];

export const TodoFooter: React.FC<TodoFooterProps> = ({
  activeTodosCount,
  completedTodosCount,
  filterStatus,
  onFilterChange,
  onClearCompleted,
}) => {
  const itemsLeftText = `${activeTodosCount} ${activeTodosCount === 1 ? 'item' : 'items'} left`;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {itemsLeftText}
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {FILTERS.map(filter => (
          <a
            key={filter.status}
            href={filter.href}
            className={classNames('filter__link', {
              selected: filterStatus === filter.status,
            })}
            data-cy={filter.dataCy}
            onClick={() => onFilterChange(filter.status)}
          >
            {filter.label}
          </a>
        ))}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodosCount === 0}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};

export { FilterStatus };
