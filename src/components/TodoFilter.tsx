import classNames from 'classnames';
import React from 'react';
import { Status } from '../types/Todo';

type Props = {
  filterBy: Status,
  setFilterBy: (filterBy: Status) => void,
  activeTodosCount: number,
  hasCompletedTodosCount: boolean,
  clearCompleted: () => void;
};

export const TodoFilter: React.FC<Props> = ({
  filterBy,
  setFilterBy,
  activeTodosCount,
  hasCompletedTodosCount,
  clearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodosCount} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          data-cy="FilterLinkAll"
          className={classNames('filter__link', {
            selected: filterBy === Status.All,
          })}
          onClick={() => setFilterBy(Status.All)}
        >
          All
        </a>

        <a
          href="#/"
          data-cy="FilterLinkActive"
          className={classNames('filter__link', {
            selected: filterBy === Status.Active,
          })}
          onClick={() => setFilterBy(Status.Active)}
        >
          Active
        </a>

        <a
          href="#/"
          data-cy="FilterLinkCompleted"
          className={classNames('filter__link', {
            selected: filterBy === Status.Completed,
          })}
          onClick={() => setFilterBy(Status.Completed)}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      <button
        type="button"
        data-cy="ClearCompletedButton"
        className="todoapp__clear-completed"
        disabled={!hasCompletedTodosCount}
        onClick={clearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
