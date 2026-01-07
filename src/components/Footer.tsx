import React from 'react';
import classNames from 'classnames';
import { Filter } from '../types/Filter';

interface Props {
  activeTodosCount: number;
  filter: Filter;
  onFilterChange: (filter: Filter) => void;
  hasCompletedTodos: boolean;
}

export const Footer: React.FC<Props> = ({
  activeTodosCount,
  filter,
  onFilterChange,
  hasCompletedTodos,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="TodosCounter">
      {activeTodosCount} items left
    </span>

    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        onClick={e => {
          e.preventDefault();
          onFilterChange(Filter.All);
        }}
        className={classNames('filter__link', {
          selected: filter === Filter.All,
        })}
        data-cy="FilterLinkAll"
      >
        All
      </a>

      <a
        href="#/active"
        onClick={e => {
          e.preventDefault();
          onFilterChange(Filter.Active);
        }}
        className={classNames('filter__link', {
          selected: filter === Filter.Active,
        })}
        data-cy="FilterLinkActive"
      >
        Active
      </a>

      <a
        href="#/completed"
        onClick={e => {
          e.preventDefault();
          onFilterChange(Filter.Completed);
        }}
        className={classNames('filter__link', {
          selected: filter === Filter.Completed,
        })}
        data-cy="FilterLinkCompleted"
      >
        Completed
      </a>
    </nav>

    <button
      type="button"
      className="todoapp__clear-completed"
      data-cy="ClearCompletedButton"
      disabled={!hasCompletedTodos}
    >
      Clear completed
    </button>
  </footer>
);
