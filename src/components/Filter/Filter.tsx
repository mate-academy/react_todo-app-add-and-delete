import React from 'react';
import classNames from 'classnames';
import { FilterKey } from '../../types/FilterKey';

type Props = {
  filterKey: FilterKey,
  onClick: (key: FilterKey) => void
};

export const Filter: React.FC<Props> = ({ filterKey, onClick }) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        data-cy="FilterLinkAll"
        href="#/"
        className={classNames('filter__link', {
          selected: filterKey === FilterKey.All,
        })}
        onClick={() => onClick(FilterKey.All)}
      >
        All
      </a>

      <a
        data-cy="FilterLinkActive"
        href="#/active"
        className={classNames('filter__link', {
          selected: filterKey === FilterKey.Active,
        })}
        onClick={() => onClick(FilterKey.Active)}
      >
        Active
      </a>

      <a
        data-cy="FilterLinkCompleted"
        href="#/completed"
        className={classNames('filter__link', {
          selected: filterKey === FilterKey.Completed,
        })}
        onClick={() => onClick(FilterKey.Completed)}
      >
        Completed
      </a>
    </nav>
  );
};
