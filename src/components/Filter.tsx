import React from 'react';
import cn from 'classnames';
import { FilterStatus } from '../types/FilterStatus';

type Props = {
  filter: FilterStatus;
  onChange: (filter: FilterStatus) => void;
};

export const Filter: React.FC<Props> = ({ filter, onChange }) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={cn('filter__link', {
          selected: filter === FilterStatus.All,
        })}
        data-cy="FilterLinkAll"
        onClick={e => {
          e.preventDefault();
          onChange(FilterStatus.All);
        }}
      >
        All
      </a>

      <a
        href="#/active"
        className={cn('filter__link', {
          selected: filter === FilterStatus.Active,
        })}
        data-cy="FilterLinkActive"
        onClick={e => {
          e.preventDefault();
          onChange(FilterStatus.Active);
        }}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={cn('filter__link', {
          selected: filter === FilterStatus.Completed,
        })}
        data-cy="FilterLinkCompleted"
        onClick={e => {
          e.preventDefault();
          onChange(FilterStatus.Completed);
        }}
      >
        Completed
      </a>
    </nav>
  );
};
