import React from 'react';
import classNames from 'classnames';
import { Filter } from '../types/Filter';

type Props = {
  filter: Filter;
  setFilter: (filter: Filter) => void;
};

export const TodoFilter: React.FC<Props> = ({ filter, setFilter }) => {
  const handleSetFilter = (filterType: Filter) => () => {
    setFilter(filterType);
  };

  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={classNames(
          'filter__link', {
            selected: filter === 'all',
          },
        )}
        data-cy="FilterLinkAll"
        onClick={handleSetFilter('all')}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames(
          'filter__link', {
            selected: filter === 'active',
          },
        )}
        data-cy="FilterLinkActive"
        onClick={handleSetFilter('active')}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames(
          'filter__link', {
            selected: filter === 'completed',
          },
        )}
        data-cy="FilterLinkCompleted"
        onClick={handleSetFilter('completed')}
      >
        Completed
      </a>
    </nav>
  );
};
