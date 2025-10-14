import React from 'react';
import { StatusFilter } from '../../App';

type Props = {
  todosCount: number;
  completedCount: number;
  statusFilter: StatusFilter;
  setStatusFilter: React.Dispatch<React.SetStateAction<StatusFilter>>;
  onClearCompleted?: () => void;
};

export const Footer: React.FC<Props> = ({
  todosCount,
  statusFilter,
  setStatusFilter,
  completedCount,
  onClearCompleted,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="TodosCounter">
      {todosCount} items left
    </span>

    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        data-cy="FilterLinkAll"
        className={`filter__link ${statusFilter === 'all' ? 'selected' : ''}`}
        onClick={e => {
          e.preventDefault();
          setStatusFilter(StatusFilter.All);
        }}
      >
        All
      </a>
      <a
        href="#/active"
        data-cy="FilterLinkActive"
        className={`filter__link ${statusFilter === 'active' ? 'selected' : ''}`}
        onClick={e => {
          e.preventDefault();
          setStatusFilter(StatusFilter.Active);
        }}
      >
        Active
      </a>
      <a
        href="#/completed"
        data-cy="FilterLinkCompleted"
        className={`filter__link ${statusFilter === 'completed' ? 'selected' : ''}`}
        onClick={e => {
          e.preventDefault();
          setStatusFilter(StatusFilter.Completed);
        }}
      >
        Completed
      </a>
    </nav>

    <button
      type="button"
      className="todoapp__clear-completed"
      data-cy="ClearCompletedButton"
      disabled={completedCount === 0}
      onClick={onClearCompleted}
    >
      Clear completed
    </button>
  </footer>
);
