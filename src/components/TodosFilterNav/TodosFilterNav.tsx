import React from 'react';
import classNames from 'classnames';

import { FilterStatus } from '../../types/FilterStatus';

interface Props {
  filterBy: FilterStatus;
  onFilter: (filterType: FilterStatus) => void;
}

export const TodosFilterNav: React.FC<Props> = ({ filterBy, onFilter }) => (
  <nav className="filter" data-cy="Filter">
    <a
      data-cy="FilterLinkAll"
      href="#/"
      className={classNames('filter__link', {
        selected: filterBy === FilterStatus.ALL,
      })}
      onClick={() => {
        onFilter(FilterStatus.ALL);
      }}
    >
      All
    </a>

    <a
      data-cy="FilterLinkActive"
      href="#/active"
      className={classNames('filter__link', {
        selected: filterBy === FilterStatus.ACTIVE,
      })}
      onClick={() => {
        onFilter(FilterStatus.ACTIVE);
      }}
    >
      Active
    </a>
    <a
      data-cy="FilterLinkCompleted"
      href="#/completed"
      className={classNames('filter__link', {
        selected: filterBy === FilterStatus.COMPLETED,
      })}
      onClick={() => {
        onFilter(FilterStatus.COMPLETED);
      }}
    >
      Completed
    </a>
  </nav>
);
