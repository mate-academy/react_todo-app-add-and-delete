import classNames from 'classnames';
import { Filter } from '../types/Filter';
import React from 'react';

type Props = {
  activeTodosAmount: number;
  currentFilter: Filter;
  handleClearCompleted: () => void;
  handleFilterChange: (filter: Filter) => () => void;
  hasCompletedTodos: boolean;
};

export const TodoFooter: React.FC<Props> = ({
  activeTodosAmount,
  currentFilter,
  hasCompletedTodos,
  handleClearCompleted,
  handleFilterChange,
}) => {
  const getFilterClass = (linkFilter: Filter) =>
    classNames({
      filter__link: true,
      selected: linkFilter === currentFilter,
    });

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosAmount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={getFilterClass(Filter.All)}
          data-cy="FilterLinkAll"
          onClick={handleFilterChange(Filter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={getFilterClass(Filter.Active)}
          data-cy="FilterLinkActive"
          onClick={handleFilterChange(Filter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={getFilterClass(Filter.Completed)}
          data-cy="FilterLinkCompleted"
          onClick={handleFilterChange(Filter.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        disabled={!hasCompletedTodos}
        data-cy="ClearCompletedButton"
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
