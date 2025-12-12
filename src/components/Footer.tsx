import React from 'react';
import classNames from 'classnames';
import { Filter } from '../types/Filter';

interface FooterProps {
  activeCount: number;
  completedCount: number;
  filter: Filter;
  setFilter: (f: Filter) => void;
  onClearCompleted: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  activeCount,
  completedCount,
  filter,
  setFilter,
  onClearCompleted,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="TodosCounter">
      {activeCount} {activeCount === 1 ? 'item' : 'items'} left
    </span>

    {/* Active link should have the 'selected' class */}
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: filter === Filter.All,
        })}
        data-cy="FilterLinkAll"
        onClick={e => {
          e.preventDefault();
          setFilter(Filter.All);
        }}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: filter === Filter.Active,
        })}
        data-cy="FilterLinkActive"
        onClick={e => {
          e.preventDefault();
          setFilter(Filter.Active);
        }}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: filter === Filter.Completed,
        })}
        data-cy="FilterLinkCompleted"
        onClick={e => {
          e.preventDefault();
          setFilter(Filter.Completed);
        }}
      >
        Completed
      </a>
    </nav>

    {/* this button should be disabled if there are no completed todos */}
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
