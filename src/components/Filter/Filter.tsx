import React from 'react';
import cn from 'classnames';
import { Filters } from '../../types/Filters';

type Props = {
  value: Filters;
  onChange: (filter: Filters) => void;
};

export const Filter: React.FC<Props> = ({ value, onChange }) => {
  const handleChangeFilter = (newFilter: Filters) => {
    if (newFilter !== value) {
      onChange(newFilter);
    }
  };

  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={cn('filter__link', { selected: value === Filters.ALL })}
        data-cy="FilterLinkAll"
        onClick={() => {
          handleChangeFilter(Filters.ALL);
        }}
      >
        All
      </a>

      <a
        href="#/active"
        className={cn('filter__link', { selected: value === Filters.ACTIVE })}
        data-cy="FilterLinkActive"
        onClick={() => {
          handleChangeFilter(Filters.ACTIVE);
        }}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={cn('filter__link', {
          selected: value === Filters.COMPLETED,
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => {
          handleChangeFilter(Filters.COMPLETED);
        }}
      >
        Completed
      </a>
    </nav>
  );
};
