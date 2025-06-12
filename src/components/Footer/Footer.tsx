import React from 'react';
import { StatusFilter } from '../../types/TodoStatus';

type Props = {
  quantityActiveItems: number;
  statusFilter: string;
  onStatusFilter: (status: StatusFilter) => void;
  onFindActive: () => boolean;
  onDeleteActive: () => void;
};

export const Footer: React.FC<Props> = ({
  quantityActiveItems,
  statusFilter,
  onStatusFilter,
  onFindActive,
  onDeleteActive,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {quantityActiveItems} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={`filter__link ${statusFilter === 'all' ? 'selected ' : ''}`}
          data-cy="FilterLinkAll"
          onClick={() => onStatusFilter(StatusFilter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link ${statusFilter === 'active' ? 'selected ' : ''}`}
          data-cy="FilterLinkActive"
          onClick={() => onStatusFilter(StatusFilter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link ${statusFilter === 'completed' ? 'selected ' : ''}`}
          data-cy="FilterLinkCompleted"
          onClick={() => onStatusFilter(StatusFilter.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!onFindActive()}
        onClick={onDeleteActive}
      >
        Clear completed
      </button>
    </footer>
  );
};
