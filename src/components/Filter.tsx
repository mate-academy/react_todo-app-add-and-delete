import React from 'react';
import classNames from 'classnames';

export type FilterType = 'all' | 'active' | 'completed';

type Props = {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
};

export const Filter: React.FC<Props> = ({ filter, onFilterChange }) => {
  const handleFilterClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    nextFilter: FilterType,
  ) => {
    event.preventDefault();
    onFilterChange(nextFilter);
  };

  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: filter === 'all',
        })}
        data-cy="FilterLinkAll"
        onClick={event => handleFilterClick(event, 'all')}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: filter === 'active',
        })}
        data-cy="FilterLinkActive"
        onClick={event => handleFilterClick(event, 'active')}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: filter === 'completed',
        })}
        data-cy="FilterLinkCompleted"
        onClick={event => handleFilterClick(event, 'completed')}
      >
        Completed
      </a>
    </nav>
  );
};
