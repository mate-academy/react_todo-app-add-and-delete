import React from 'react';
import classNames from 'classnames';
import { FilteringOptions } from '../../types/Filter';

interface Props {
  filter: FilteringOptions;
  setFilter: (filter: FilteringOptions) => void;
}

export const Filter: React.FC<Props> = ({
  filter,
  setFilter,
}) => {
  return (
    <nav className="filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: filter === FilteringOptions.all,
        })}
        onClick={() => setFilter(FilteringOptions.all)}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: filter === FilteringOptions.active,
        })}
        onClick={() => setFilter(FilteringOptions.active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: filter === FilteringOptions.completed,
        })}
        onClick={() => setFilter(FilteringOptions.completed)}
      >
        Completed
      </a>
    </nav>
  );
};
