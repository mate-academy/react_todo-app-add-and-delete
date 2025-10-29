import React from 'react';
import cn from 'classnames';
import { Filters } from '../constants/filter';

type Props = {
  filter: Filters;
  onSetFilter: (filter: Filters) => void;
};

export const Filter: React.FC<Props> = ({ filter, onSetFilter }) => (
  <nav className="filter" data-cy="Filter">
    <a
      href="#/"
      className={cn('filter__link', { selected: filter === Filters.All })}
      data-cy="FilterLinkAll"
      onClick={() => onSetFilter(Filters.All)}
    >
      All
    </a>

    <a
      href="#/active"
      className={cn('filter__link', { selected: filter === Filters.Active })}
      data-cy="FilterLinkActive"
      onClick={() => onSetFilter(Filters.Active)}
    >
      Active
    </a>

    <a
      href="#/completed"
      className={cn('filter__link', { selected: filter === Filters.Completed })}
      data-cy="FilterLinkCompleted"
      onClick={() => onSetFilter(Filters.Completed)}
    >
      Completed
    </a>
  </nav>
);
