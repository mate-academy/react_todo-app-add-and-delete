import React from 'react';
import classNames from 'classnames';
import { FILTERS } from '../utils/constants';

type Props = {
  filter: string;
  onFilterChange: (filter: string) => void;
};

export const Filter: React.FC<Props> = ({ filter, onFilterChange }) => {
  return (
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
};
