import React from 'react';
import classNames from 'classnames';
import { FilteringOption } from '../../types/Filter';

interface Props {
  filter: FilteringOption;
  setFilter: (filter: FilteringOption) => void;
}

export const Filter: React.FC<Props> = ({
  filter,
  setFilter,
}) => (
  <nav className="filter">
    <a
      href="#/"
      className={classNames('filter__link', {
        selected: filter === FilteringOption.all,
      })}
      onClick={() => setFilter(FilteringOption.all)}
    >
      All
    </a>

    <a
      href="#/active"
      className={classNames('filter__link', {
        selected: filter === FilteringOption.active,
      })}
      onClick={() => setFilter(FilteringOption.active)}
    >
      Active
    </a>

    <a
      href="#/completed"
      className={classNames('filter__link', {
        selected: filter === FilteringOption.completed,
      })}
      onClick={() => setFilter(FilteringOption.completed)}
    >
      Completed
    </a>
  </nav>
);
