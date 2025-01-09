import React from 'react';
import classNames from 'classnames';
import { Filter } from '../types/Filter';

interface FooterProps {
  filter: Filter;
  setFilter: (filter: Filter) => void;
  activeTodosCount: number;
  completedTodosCount: number;
  handleClearCompleted: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  filter,
  setFilter,
  activeTodosCount,
  completedTodosCount,
  handleClearCompleted,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="TodosCounter">
      {activeTodosCount} items left
    </span>

    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: filter === Filter.All,
        })}
        data-cy="FilterLinkAll"
        onClick={() => setFilter(Filter.All)}
      >
        All
      </a>
      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: filter === Filter.Active,
        })}
        data-cy="FilterLinkActive"
        onClick={() => setFilter(Filter.Active)}
      >
        Active
      </a>
      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: filter === Filter.Completed,
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => setFilter(Filter.Completed)}
      >
        Completed
      </a>
    </nav>

    <button
      type="button"
      className="todoapp__clear-completed"
      data-cy="ClearCompletedButton"
      disabled={completedTodosCount === 0}
      onClick={handleClearCompleted}
    >
      Clear completed
    </button>
  </footer>
);
