import React from 'react';
import cn from 'classnames';
import { FILTERS, FilterType } from '../constants/filters';

type Props = {
  current: FilterType;
  onChange: (next: FilterType) => void;
};

export const Filter: React.FC<Props> = ({ current, onChange }) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={cn('filter__link', { selected: current === FILTERS.all })}
        data-cy="FilterLinkAll"
        onClick={() => onChange(FILTERS.all)}
      >
        All
      </a>

      <a
        href="#/active"
        className={cn('filter__link', { selected: current === FILTERS.active })}
        data-cy="FilterLinkActive"
        onClick={() => onChange(FILTERS.active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={cn('filter__link', {
          selected: current === FILTERS.completed,
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => onChange(FILTERS.completed)}
      >
        Completed
      </a>
    </nav>
  );
};
