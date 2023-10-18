import React from 'react';
import cn from 'classnames';
import { FilterBy } from '../../types/FilterBy';

type Props = {
  filteredBy: FilterBy;
  setFilteredBy: (filterBy: FilterBy) => void;
};

export const TodosFilter: React.FC<Props> = ({ filteredBy, setFilteredBy }) => {
  const onFilterSelect = (filter: FilterBy) => () => {
    setFilteredBy(filter);
  };

  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        data-cy="FilterLinkAll"
        className={
          cn('filter__link', { selected: filteredBy === FilterBy.all })
        }
        onClick={onFilterSelect(FilterBy.all)}
      >
        {FilterBy.all}
      </a>

      <a
        href="#/active"
        data-cy="FilterLinkActive"
        className={
          cn('filter__link', { selected: filteredBy === FilterBy.active })
        }
        onClick={onFilterSelect(FilterBy.active)}
      >
        {FilterBy.active}
      </a>

      <a
        href="#/completed"
        data-cy="FilterLinkCompleted"
        className={
          cn('filter__link', { selected: filteredBy === FilterBy.completed })
        }
        onClick={onFilterSelect(FilterBy.completed)}
      >
        {FilterBy.completed}
      </a>
    </nav>
  );
};
