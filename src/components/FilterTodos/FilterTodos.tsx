import React from 'react';
import classNames from 'classnames';

import { FilterType } from '../../types/FilterType';

type Props = {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
};

export const FilterTodos: React.FC<Props> = ({ filter, onFilterChange }) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        data-cy="FilterLinkAll"
        href="#/"
        className={classNames('filter__link', {
          selected: filter === FilterType.All,
        })}
        onClick={() => onFilterChange(FilterType.All)}
      >
        {FilterType.All}
      </a>

      <a
        data-cy="FilterLinkActive"
        href="#/active"
        className={classNames('filter__link', {
          selected: filter === FilterType.Active,
        })}
        onClick={() => onFilterChange(FilterType.Active)}
      >
        {FilterType.Active}
      </a>
      <a
        data-cy="FilterLinkCompleted"
        href="#/completed"
        className={classNames('filter__link', {
          selected: filter === FilterType.Completed,
        })}
        onClick={() => onFilterChange(FilterType.Completed)}
      >
        {FilterType.Completed}
      </a>
    </nav>
  );
};
