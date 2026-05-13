import cn from 'classnames';
import React from 'react';

import { FilterStatus } from '../types/FilterStatus';

const filters = [
  {
    status: FilterStatus.All,
    title: 'All',
    dataCy: 'FilterLinkAll',
    href: '#/',
  },
  {
    status: FilterStatus.Active,
    title: 'Active',
    dataCy: 'FilterLinkActive',
    href: '#/active',
  },
  {
    status: FilterStatus.Completed,
    title: 'Completed',
    dataCy: 'FilterLinkCompleted',
    href: '#/completed',
  },
];

type Props = {
  activeTodosCount: number;
  hasCompletedTodos: boolean;
  filterStatus: FilterStatus;
  onFilterChange: (status: FilterStatus) => void;
  onClearCompleted: () => void;
};

export const TodoFooter: React.FC<Props> = ({
  activeTodosCount,
  hasCompletedTodos,
  filterStatus,
  onFilterChange,
  onClearCompleted,
}) => {
  const todosCountText = `${activeTodosCount} ${
    activeTodosCount === 1 ? 'item' : 'items'
  } left`;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosCountText}
      </span>

      <nav className="filter" data-cy="Filter">
        {filters.map(({ status, title, dataCy, href }) => (
          <a
            key={status}
            href={href}
            className={cn('filter__link', {
              selected: filterStatus === status,
            })}
            data-cy={dataCy}
            onClick={() => onFilterChange(status)}
          >
            {title}
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
