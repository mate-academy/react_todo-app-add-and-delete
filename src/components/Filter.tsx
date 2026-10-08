import React from 'react';
import classNames from 'classnames';
import { FILTERS } from '../App';

type FilterType = (typeof FILTERS)[keyof typeof FILTERS];

type Props = {
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
};

export const Filter: React.FC<Props> = ({ filter, setFilter }) => {
  const handleFilterClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    selectedFilter: FilterType,
  ) => {
    event.preventDefault();
    setFilter(selectedFilter);
  };

  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: filter === FILTERS.all,
        })}
        data-cy="FilterLinkAll"
        onClick={event => handleFilterClick(event, FILTERS.all)}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: filter === FILTERS.active,
        })}
        data-cy="FilterLinkActive"
        onClick={event => handleFilterClick(event, FILTERS.active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: filter === FILTERS.completed,
        })}
        data-cy="FilterLinkCompleted"
        onClick={event => handleFilterClick(event, FILTERS.completed)}
      >
        Completed
      </a>
    </nav>
  );
};
