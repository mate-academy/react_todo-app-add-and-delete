import React from 'react';
import classNames from 'classnames';
import { FilterStatus } from '../../types/FilterStatus';

interface Props {
  filter: FilterStatus;
  onChangeFilter: (filter: FilterStatus) => void;
}

export const Filter: React.FC<Props> = ({ filter, onChangeFilter }) => (
  <nav className="filter">
    <a
      href="#/"
      className={classNames('filter__link', {
        selected: filter === FilterStatus.ALL,
      })}
      onClick={(event) => {
        event.preventDefault();
        onChangeFilter(FilterStatus.ALL);
      }}
    >
      All
    </a>

    <a
      href="#/active"
      className={classNames('filter__link', {
        selected: filter === FilterStatus.ACTIVE,
      })}
      onClick={(event) => {
        event.preventDefault();
        onChangeFilter(FilterStatus.ACTIVE);
      }}
    >
      Active
    </a>

    <a
      href="#/completed"
      className={classNames('filter__link', {
        selected: filter === FilterStatus.COMPLETED,
      })}
      onClick={(event) => {
        event.preventDefault();
        onChangeFilter(FilterStatus.COMPLETED);
      }}
    >
      Completed
    </a>
  </nav>
);
