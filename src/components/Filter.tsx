import React from 'react';
import cn from 'classnames';
import { Filters } from '../types/Filters';

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
        className={cn('filter__link', { selected: value === Filters.all })}
        data-cy="FilterLinkAll"
        onClick={() => {
          handleChangeFilter(Filters.all);
        }}
      >
        All
      </a>

      <a
        href="#/active"
        className={cn('filter__link', { selected: value === Filters.active })}
        data-cy="FilterLinkActive"
        onClick={() => {
          handleChangeFilter(Filters.active);
        }}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={cn('filter__link', {
          selected: value === Filters.completed,
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => {
          handleChangeFilter(Filters.completed);
        }}
      >
        Completed
      </a>
    </nav>
  );
};
