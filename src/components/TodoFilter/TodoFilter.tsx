import React from 'react';
import classNames from 'classnames';
import { StatusFilter } from '../../types/Filter';

type Props = {
  filter: StatusFilter,
  setFilter: (type: StatusFilter) => void,
};

export const TodoFilter: React.FC<Props> = ({
  filter,
  setFilter,
}) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={classNames(
          'filter__link',
          { selected: filter === StatusFilter.ALL },
        )}
        onClick={() => setFilter(StatusFilter.ALL)}
        data-cy="FilterLinkAll"
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames(
          'filter__link',
          { selected: filter === StatusFilter.ACTIVE },
        )}
        onClick={() => setFilter(StatusFilter.ACTIVE)}
        data-cy="FilterLinkActive"
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames(
          'filter__link',
          { selected: filter === StatusFilter.COMPLETED },
        )}
        onClick={() => setFilter(StatusFilter.COMPLETED)}
        data-cy="FilterLinkCompleted"
      >
        Completed
      </a>
    </nav>
  );
};
