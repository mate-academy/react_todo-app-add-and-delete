import classNames from 'classnames';
import React from 'react';
import { SortType } from '../types/SortType';

interface Props {
  active: number;
  completed: number;
  setSortBy: (sorted: SortType) => void;
  sortBy: SortType;
  deleteCompleted: () => void;
}

export const Footer: React.FC<Props> = ({
  active, completed, setSortBy, sortBy, deleteCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${active} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            { 'filter__link selected': sortBy === SortType.All },
          )}
          data-cy="FilterLinkAll"
          onClick={() => setSortBy(SortType.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            { 'filter__link selected': sortBy === SortType.Active },
          )}
          data-cy="FilterLinkActive"
          onClick={() => setSortBy(SortType.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            { 'filter__link selected': sortBy === SortType.Completed },
          )}
          data-cy="FilterLinkCompleted"
          onClick={() => setSortBy(SortType.Completed)}

        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      {completed !== 0 && (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={deleteCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
