import classNames from 'classnames';
import React from 'react';
import { FilterBy } from '../../types/FilterBy';

type Props = {
  activeTodosQuantity: number,
  filterBy: FilterBy,
  setFilterBy: (filterBy: FilterBy) => void,
};

export const Footer: React.FC<Props> = ({
  activeTodosQuantity,
  filterBy,
  setFilterBy,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="todosCounter">
      {`${activeTodosQuantity} items left`}
    </span>

    <nav className="filter" data-cy="Filter">
      <a
        data-cy="FilterLinkAll"
        href="#/"
        className={classNames(
          'filter__link',
          { selected: filterBy === FilterBy.ALL },
        )}
        onClick={() => {
          setFilterBy(FilterBy.ALL);
        }}
      >
        All
      </a>

      <a
        data-cy="FilterLinkActive"
        href="#/active"
        className={classNames(
          'filter__link',
          { selected: filterBy === FilterBy.ACTIVE },
        )}
        onClick={() => {
          setFilterBy(FilterBy.ACTIVE);
        }}
      >
        Active
      </a>
      <a
        data-cy="FilterLinkCompleted"
        href="#/completed"
        className={classNames(
          'filter__link',
          { selected: filterBy === FilterBy.COMPLETED },
        )}
        onClick={() => {
          setFilterBy(FilterBy.COMPLETED);
        }}
      >
        Completed
      </a>
    </nav>

    <button
      data-cy="ClearCompletedButton"
      type="button"
      className="todoapp__clear-completed"
    >
      Clear completed
    </button>
  </footer>
);
