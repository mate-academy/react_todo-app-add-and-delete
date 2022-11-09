import classNames from 'classnames';
import React from 'react';
import { FilterBy } from '../../types/FilterBy';

type Props = {
  filterBy: FilterBy;
  handleFilter: (filter: FilterBy) => void;
};

export const TodoNav: React.FC<Props>
= React.memo(({ filterBy, handleFilter }) => (
  <nav className="filter" data-cy="Filter">
    <a
      data-cy="FilterLinkAll"
      href="#/"
      className={classNames('filter__link', {
        selected: filterBy === FilterBy.All,
      })}
      onClick={() => handleFilter(FilterBy.All)}
    >
      All
    </a>
    <a
      data-cy="FilterLinkActive"
      href="#/active"
      className={classNames('filter__link', {
        selected: filterBy === FilterBy.Active,
      })}
      onClick={() => handleFilter(FilterBy.Active)}
    >
      Active
    </a>
    <a
      data-cy="FilterLinkCompleted"
      href="#/completed"
      className={classNames('filter__link', {
        selected: filterBy === FilterBy.Completed,
      })}
      onClick={() => handleFilter(FilterBy.Completed)}
    >
      Completed
    </a>
  </nav>
));
