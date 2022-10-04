import React from 'react';
import classNames from 'classnames';

type Props = {
  sortFilter: string
  handleChangeSortFilter: (sortFilter:string) => void;
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
          { selected: sortFilter === 'all' },
        )}
        onClick={() => handleChangeSortFilter('all')}
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
        onClick={() => handleChangeSortFilter('active')}
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
        onClick={() => handleChangeSortFilter('completed')}
      >
        Completed
      </a>
    </nav>

  );
};
