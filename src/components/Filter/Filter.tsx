import React from 'react';
import cn from 'classnames';

export enum FilterBy {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

type Props = {
  active: FilterBy;
  onChange: (f: FilterBy) => void;
};

export const Filter: React.FC<Props> = ({ active, onChange }) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        data-cy="FilterLinkAll"
        className={cn({ selected: active === FilterBy.All })}
        onClick={e => {
          e.preventDefault();
          onChange(FilterBy.All);
        }}
      >
        All
      </a>

      <a
        href="#/active"
        data-cy="FilterLinkActive"
        className={cn({ selected: active === FilterBy.Active })}
        onClick={e => {
          e.preventDefault();
          onChange(FilterBy.Active);
        }}
      >
        Active
      </a>

      <a
        href="#/completed"
        data-cy="FilterLinkCompleted"
        className={cn({ selected: active === FilterBy.Completed })}
        onClick={e => {
          e.preventDefault();
          onChange(FilterBy.Completed);
        }}
      >
        Completed
      </a>
    </nav>
  );
};
