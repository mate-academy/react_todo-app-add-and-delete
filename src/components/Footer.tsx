import React from 'react';
import { Filter } from '../types/Filter';

type Props = {
  filter: Filter;
  activeTodosCount: number;
  completedTodosCount: number;
  onClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  filter,
  activeTodosCount,
  completedTodosCount,
  onClearCompleted,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="TodosCounter">
      {`${activeTodosCount} ${activeTodosCount === 1 ? 'item' : 'items'} left`}
    </span>

    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={`filter__link ${filter === 'all' ? 'selected' : ''}`}
        data-cy="FilterLinkAll"
      >
        All
      </a>

      <a
        href="#/active"
        className={`filter__link ${filter === 'active' ? 'selected' : ''}`}
        data-cy="FilterLinkActive"
      >
        Active
      </a>

      <a
        href="#/completed"
        className={`filter__link ${filter === 'completed' ? 'selected' : ''}`}
        data-cy="FilterLinkCompleted"
      >
        Completed
      </a>
    </nav>

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
