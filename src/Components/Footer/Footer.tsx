import React from 'react';
import { FilterStatus } from '../../App';

type Props = {
  onChangeFilter: (filter: FilterStatus) => void;
  activeTodos: number;
  filterStatus: FilterStatus;
  doneTodos: number;
  onClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  onChangeFilter,
  onClearCompleted,
  activeTodos,
  filterStatus,
  doneTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={`filter__link ${filterStatus === 'all' ? 'selected' : ''}`}
          data-cy="FilterLinkAll"
          onClick={() => onChangeFilter('all')}
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link ${filterStatus === 'active' ? 'selected' : ''}`}
          data-cy="FilterLinkActive"
          onClick={() => onChangeFilter('active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link ${filterStatus === 'completed' ? 'selected' : ''}`}
          data-cy="FilterLinkCompleted"
          onClick={() => onChangeFilter('completed')}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={doneTodos === 0}
        onClick={() => onClearCompleted()}
      >
        {doneTodos > 0 && 'Clear completed'}
      </button>
    </footer>
  );
};
