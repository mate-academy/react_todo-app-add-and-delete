import React from 'react';
import classNames from 'classnames';
import { Filter } from '../../types/Filter';

interface Props {
  activeTodosCount: number;
  completedTodosCount: number;
  filter: Filter;
  setFilter: (filter: Filter) => void;
  clearCompleted: () => void;
}

export const Footer: React.FC<Props> = ({
  activeTodosCount,
  filter,
  setFilter,
  clearCompleted,
  completedTodosCount
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="TodosCounter">
      {`${activeTodosCount} items left`}
    </span>

    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: filter === 'all',
        })}
        onClick={() => setFilter('all')}
        data-cy="FilterLinkAll"
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: filter === 'active',
        })}
        onClick={() => setFilter('active')}
        data-cy="FilterLinkActive"
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: filter === 'completed',
        })}
        onClick={() => setFilter('completed')}
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
      onClick={clearCompleted}
    >
      Clear completed
    </button>
  </footer>
);
