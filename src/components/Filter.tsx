import React from 'react';
import classNames from 'classnames';
import { FilterBy } from '../types/FilterBy';

type Props = {
  filterBy: FilterBy,
  setFilterBy: React.Dispatch<React.SetStateAction<FilterBy>>,
};

export const Filter: React.FC<Props> = ({
  filterBy,
  setFilterBy,
}) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        data-cy="FilterLinkAll"
        href="#/"
        className={classNames(
          'filter__link',
          {
            selected: filterBy === FilterBy.All,
          },
        )}
        onClick={() => setFilterBy(FilterBy.All)}
      >
        All
      </a>

      <a
        data-cy="FilterLinkActive"
        href="#/active"
        className={classNames(
          'filter__link',
          {
            selected: filterBy === FilterBy.Active,
          },
        )}
        onClick={() => setFilterBy(FilterBy.Active)}
      >
        Active
      </a>
      <a
        data-cy="FilterLinkCompleted"
        href="#/completed"
        className={classNames(
          'filter__link',
          {
            selected: filterBy === FilterBy.Completed,
          },
        )}
        onClick={() => setFilterBy(FilterBy.Completed)}
      >
        Completed
      </a>
    </nav>
  );
};
