import React from 'react';
import classNames from 'classnames';

import { FILTERS, FilterType } from '../constants/filters';

type Props = {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
};

export const Filter: React.FC<Props> = ({ filter, onFilterChange }) => (
  <nav className="filter" data-cy="Filter">
    <a
      href="#/"
      className={classNames('filter__link', {
        selected: filter === FILTERS.all,
      })}
      data-cy="FilterLinkAll"
      onClick={() => onFilterChange(FILTERS.all)}
    >
      All
    </a>

    <a
      href="#/active"
      className={classNames('filter__link', {
        selected: filter === FILTERS.active,
      })}
      data-cy="FilterLinkActive"
      onClick={() => onFilterChange(FILTERS.active)}
    >
      Active
    </a>

    <a
      href="#/completed"
      className={classNames('filter__link', {
        selected: filter === FILTERS.completed,
      })}
      data-cy="FilterLinkCompleted"
      onClick={() => onFilterChange(FILTERS.completed)}
    >
      Completed
    </a>
  </nav>
);
