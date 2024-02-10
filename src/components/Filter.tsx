import cn from 'classnames';
import React from 'react';
import { FilterType } from '../types/FilterType';

type Props = {
  filterType: FilterType;
  filterChange: (filter: FilterType) => void;
};

export const FilterComponent: React.FC<Props>
= ({ filterType, filterChange }) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={cn('filter__link', {
          selected: filterType === FilterType.all,
        })}
        data-cy="FilterLinkAll"
        onClick={() => {
          filterChange(FilterType.all);
        }}
      >
        All
      </a>

      <a
        href="#/active"
        className={cn('filter__link', {
          selected: filterType === FilterType.active,
        })}
        data-cy="FilterLinkActive"
        onClick={() => {
          filterChange(FilterType.active);
        }}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={cn('filter__link', {
          selected: filterType === FilterType.completed,
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => {
          filterChange(FilterType.completed);
        }}
      >
        Completed
      </a>
    </nav>
  );
};
