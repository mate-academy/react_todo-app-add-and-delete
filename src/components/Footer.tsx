import React from 'react';
import { FILTER, Filter } from '../types/Filter';

type Props = {
  activeTodosCount: number;
  hasCompletedTodos: boolean;
  filter: Filter;
  setFilter: (filter: Filter) => void;
  handleClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  activeTodosCount,
  hasCompletedTodos,
  filter,
  setFilter,
  handleClearCompleted,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="TodosCounter">
      {activeTodosCount} items left
    </span>

    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={`filter__link ${filter === FILTER.ALL ? 'selected' : ''}`}
        data-cy="FilterLinkAll"
        onClick={() => setFilter(FILTER.ALL)}
      >
        All
      </a>

      <a
        href="#/active"
        className={`filter__link ${filter === FILTER.ACTIVE ? 'selected' : ''}`}
        data-cy="FilterLinkActive"
        onClick={() => setFilter(FILTER.ACTIVE)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={`filter__link ${filter === FILTER.COMPLETED ? 'selected' : ''}`}
        data-cy="FilterLinkCompleted"
        onClick={() => setFilter(FILTER.COMPLETED)}
      >
        Completed
      </a>
    </nav>

    <button
      type="button"
      className="todoapp__clear-completed"
      data-cy="ClearCompletedButton"
      disabled={!hasCompletedTodos}
      onClick={handleClearCompleted}
    >
      Clear completed
    </button>
  </footer>
);
