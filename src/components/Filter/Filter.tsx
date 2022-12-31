import classNames from 'classnames';
import React from 'react';
import { Filters } from '../../types/Filters';

type Props = {
  filterBy: string,
  setFilterBy: (val: Filters) => void,
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
        className={
          classNames('filter__link', {
            selected: filterBy === Filters.All,
          })
        }
        onClick={() => setFilterBy(Filters.All)}
      >
        All
      </a>

      <a
        data-cy="FilterLinkActive"
        href="#/active"
        className={
          classNames('filter__link', {
            selected: filterBy === Filters.Active,
          })
        }
        onClick={() => setFilterBy(Filters.Active)}
      >
        Active
      </a>
      <a
        data-cy="FilterLinkCompleted"
        href="#/completed"
        className={
          classNames('filter__link', {
            selected: filterBy === Filters.Completed,
          })
        }
        onClick={() => setFilterBy(Filters.Completed)}
      >
        Completed
      </a>
    </nav>
  );
};
