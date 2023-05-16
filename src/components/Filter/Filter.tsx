import React from 'react';
import classNames from 'classnames';
import { FilterStatus } from '../../types/FilterStatus';

interface Props {
  filter: FilterStatus;
  setFilter: (filter: FilterStatus) => void;
}

export const Filter: React.FC<Props> = ({ filter, setFilter }) => (
  <nav className="filter">
    <a
      href="#/"
      className={classNames('filter__link', {
        selected: filter === FilterStatus.ALL,
      })}
      onClick={(event) => {
        event.preventDefault();
        setFilter(FilterStatus.ALL);
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
        setFilter(FilterStatus.ACTIVE);
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
        setFilter(FilterStatus.COMPLETED);
      }}
    >
      Completed
    </a>
  </nav>
);
