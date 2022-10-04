import React from 'react';
import classNames from 'classnames';

type Props = {
  sortFilter: string
  setSortFilter: (sortFilter:string) => void;
};

export const Filter: React.FC<Props> = ({
  sortFilter,
  setSortFilter,
}) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        data-cy="FilterLinkAll"
        href="#/"
        className={classNames(
          'filter__link',
          { selected: sortFilter === 'all' },
        )}
        onClick={() => (
          sortFilter !== 'all'
          && setSortFilter('all')
        )}
      >
        All
      </a>

      <a
        data-cy="FilterLinkActive"
        href="#/active"
        className={classNames(
          'filter__link',
          { selected: sortFilter === 'active' },
        )}
        onClick={() => (
          sortFilter !== 'active'
          && setSortFilter('active')
        )}
      >
        Active
      </a>
      {}
      <a
        data-cy="FilterLinkCompleted"
        href="#/completed"
        className={classNames(
          'filter__link',
          { selected: sortFilter === 'completed' },
        )}
        onClick={() => (
          sortFilter !== 'completed'
          && setSortFilter('completed')
        )}
      >
        Completed
      </a>
    </nav>

  );
};
