import React from 'react';
import { Filter } from '../types/Filter';

type Props = {
  activeTodos: number;
  filter: Filter;
  onChangeFilter: (filter: Filter) => void;
  hasCompleted: boolean;
  handleDeleteCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  activeTodos,
  filter,
  onChangeFilter,
  hasCompleted,
  handleDeleteCompleted,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="TodosCounter">
      {activeTodos} items left
    </span>
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={`filter__link ${filter === Filter.All ? 'selected' : ''}`}
        onClick={() => onChangeFilter(Filter.All)}
        data-cy="FilterLinkAll"
      >
        All
      </a>
      <a
        href="#/active"
        className={`filter__link ${filter === Filter.Active ? 'selected' : ''}`}
        onClick={() => onChangeFilter(Filter.Active)}
        data-cy="FilterLinkActive"
      >
        Active
      </a>
      <a
        href="#/completed"
        className={`filter__link ${filter === Filter.Completed ? 'selected' : ''}`}
        onClick={() => onChangeFilter(Filter.Completed)}
        data-cy="FilterLinkCompleted"
      >
        Completed
      </a>
    </nav>
    <button
      type="button"
      className="todoapp__clear-completed"
      data-cy="ClearCompletedButton"
      disabled={!hasCompleted}
      onClick={() => handleDeleteCompleted()}
    >
      Clear completed
    </button>
  </footer>
);
