import React from 'react';
import classNames from 'classnames';
import { FilterBy } from '../../types/FilterBy';

interface Props {
  typeFilter: FilterBy;
  onFilter: (type: FilterBy) => void;
}

export const TodoFilter: React.FC<Props> = ({ typeFilter, onFilter }) => (
  <nav className="filter">
    <a
      href="#/"
      className={classNames('filter__link', {
        selected: typeFilter === FilterBy.all,
      })}
      onClick={(event) => {
        event.preventDefault();
        onFilter(FilterBy.all);
      }}
    >
      All
    </a>

    <a
      href="#/active"
      className={classNames('filter__link', {
        selected: typeFilter === FilterBy.active,
      })}
      onClick={(event) => {
        event.preventDefault();
        onFilter(FilterBy.active);
      }}
    >
      Active
    </a>

    <a
      href="#/completed"
      className={classNames('filter__link', {
        selected: typeFilter === FilterBy.completed,
      })}
      onClick={(event) => {
        event.preventDefault();
        onFilter(FilterBy.completed);
      }}
    >
      Completed
    </a>
  </nav>
);
