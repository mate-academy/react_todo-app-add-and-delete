import classNames from 'classnames';
import React from 'react';
import { Filter } from '../types/Filter';

type Props = {
  filter: Filter;
  activeTodosCount: number;
  hasCompletedTodos: boolean;
  onFilterChange: (filter: Filter) => void;
  onClearCompleted: () => void;
};

export const TodoFooter: React.FC<Props> = ({
  filter,
  activeTodosCount,
  hasCompletedTodos,
  onFilterChange,
  onClearCompleted,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="TodosCounter">
      {activeTodosCount} items left
    </span>

    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: filter === Filter.AllTest,
        })}
        data-cy="FilterLinkAll"
        onClick={() => onFilterChange(Filter.AllTest)}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: filter === Filter.Active,
        })}
        data-cy="FilterLinkActive"
        onClick={() => onFilterChange(Filter.Active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: filter === Filter.Completed,
        })}
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
      disabled={!hasCompletedTodos}
      onClick={onClearCompleted}
    >
      Clear completed
    </button>
  </footer>
);
