import React from 'react';
import classNames from 'classnames';
import { SortFilter } from '../types/SortFilter';

type Props = {
  sortFilter: SortFilter
  handleChangeSortFilter: (sort:SortFilter) => void;
};

export const Filter: React.FC<Props> = ({
  sortFilter,
  handleChangeSortFilter,
}) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        data-cy="FilterLinkAll"
        href="#/"
        className={classNames(
          'filter__link',
          { selected: sortFilter === SortFilter.all },
        )}
        onClick={() => handleChangeSortFilter(SortFilter.all)}
      >
        All
      </a>

      <a
        data-cy="FilterLinkActive"
        href="#/active"
        className={classNames(
          'filter__link',
          { selected: sortFilter === SortFilter.active },
        )}
        onClick={() => handleChangeSortFilter(SortFilter.active)}
      >
        Active
      </a>
      {}
      <a
        data-cy="FilterLinkCompleted"
        href="#/completed"
        className={classNames(
          'filter__link',
          { selected: sortFilter === SortFilter.completed },
        )}
        onClick={() => handleChangeSortFilter(SortFilter.completed)}
      >
        Completed
      </a>
    </nav>

  );
};
