import React from 'react';
import cn from 'classnames';

import { FilterType } from '../../types/FilterType';

interface Props {
  filterBy: FilterType;
  onFilter: (filterType: FilterType) => void;
}

export const FiltersNavigation: React.FC<Props> = ({ filterBy, onFilter }) => (
  <nav className="filter" data-cy="Filter">
    <a
      data-cy="FilterLinkAll"
      href="#/"
      className={cn('filter__link', {
        selected: filterBy === FilterType.ALL,
      })}
      onClick={() => {
        onFilter(FilterType.ALL);
      }}
    >
      All
    </a>

    <a
      data-cy="FilterLinkActive"
      href="#/active"
      className={cn('filter__link', {
        selected: filterBy === FilterType.ACTIVE,
      })}
      onClick={() => {
        onFilter(FilterType.ACTIVE);
      }}
    >
      Active
    </a>
    <a
      data-cy="FilterLinkCompleted"
      href="#/completed"
      className={cn('filter__link', {
        selected: filterBy === FilterType.COMPLETED,
      })}
      onClick={() => {
        onFilter(FilterType.COMPLETED);
      }}
    >
      Completed
    </a>
  </nav>
);
