import React from 'react';
import classNames from 'classnames';

type Props = {
  filter: 'all' | 'active' | 'completed';
  setFilter: (filter: 'all' | 'active' | 'completed') => void;
  todosLeft: number;
  hasCompleted: boolean;
  clearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  filter,
  setFilter,
  todosLeft,
  hasCompleted,
  clearCompleted,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="TodosCounter">
      {todosLeft} items left
    </span>

    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={classNames('filter__link', { selected: filter === 'all' })}
        data-cy="FilterLinkAll"
        onClick={e => {
          e.preventDefault();
          setFilter('all');
        }}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: filter === 'active',
        })}
        data-cy="FilterLinkActive"
        onClick={e => {
          e.preventDefault();
          setFilter('active');
        }}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: filter === 'completed',
        })}
        data-cy="FilterLinkCompleted"
        onClick={e => {
          e.preventDefault();
          setFilter('completed');
        }}
      >
        Completed
      </a>
    </nav>

    <button
      type="button"
      className="todoapp__clear-completed"
      data-cy="ClearCompletedButton"
      disabled={!hasCompleted}
      onClick={clearCompleted}
    >
      Clear completed
    </button>
  </footer>
);
