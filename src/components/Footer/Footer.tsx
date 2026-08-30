/* eslint-disable prettier/prettier */
import React from 'react';
import { Filter } from '../../types/Filter';

type Props = {
  activeTodosCount: number;
  completedTodosCount: number;
  filter: Filter;
  onFilterChange: (newFilter: Filter) => void;
  onClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  activeTodosCount,
  completedTodosCount,
  filter,
  onFilterChange,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={`filter__link ${
            filter === Filter.All ? 'selected' : ''
          }`}
          data-cy="FilterLinkAll"
          onClick={() => onFilterChange(Filter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link ${
            filter === Filter.Active ? 'selected' : ''
          }`}
          data-cy="FilterLinkActive"
          onClick={() => onFilterChange(Filter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link ${
            filter === Filter.Completed ? 'selected' : ''
          }`}
          data-cy="FilterLinkCompleted"
          onClick={() => onFilterChange(Filter.Completed)}
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
};
