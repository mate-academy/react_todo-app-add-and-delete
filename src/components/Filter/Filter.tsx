import React from 'react';
import classNames from 'classnames';
import { FILTERS } from '../../types/FILTERS';

type Props = {
  filter: FILTERS;
  setFilter: (v: FILTERS) => void;
};

export const Filter: React.FC<Props> = React.memo(({
  filter, setFilter,
}) => {
  return (
    <nav className="filter">
      <a
        href="#/"
        className={classNames(
          'filter__link',
          { selected: filter === FILTERS.ALL },
        )}
        onClick={() => setFilter(FILTERS.ALL)}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames(
          'filter__link',
          { selected: filter === FILTERS.ACTIVE },
        )}
        onClick={() => setFilter(FILTERS.ACTIVE)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames(
          'filter__link',
          { selected: filter === FILTERS.COMPLETED },
        )}
        onClick={() => setFilter(FILTERS.COMPLETED)}
      >
        Completed
      </a>
    </nav>
  );
});
