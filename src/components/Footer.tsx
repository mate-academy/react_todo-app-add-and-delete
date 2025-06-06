import React from 'react';
import classNames from 'classnames';
import { Filter } from '../types/Filter';

type FooterProps = {
  activeTodosQuantity: number;
  filter: Filter;
  setFilter: (filter: Filter) => void;
  totalTodos: number;
  clearCompletedTodos: () => void;
};

export const Footer: React.FC<FooterProps> = ({
  activeTodosQuantity,
  filter,
  setFilter,
  totalTodos,
  clearCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosQuantity} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filter === 'All',
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilter('All')}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filter === 'Active',
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilter('Active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filter === 'Completed',
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter('Completed')}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={totalTodos === activeTodosQuantity}
        onClick={clearCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
