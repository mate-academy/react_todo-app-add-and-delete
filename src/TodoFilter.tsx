import React from 'react';
import classNames from 'classnames';
import { FilterType } from './types/FilterType';

type Props = {
  setFilter: (filter: FilterType) => void;
  filter: FilterType;
};

export const TodoFilter: React.FC<Props> = ({ filter, setFilter }) => {
  return (
    <nav className="filter">
      <a
        onClick={() => setFilter(FilterType.ALL)}
        href="#/"
        className={classNames('filter__link', {
          selected: filter === FilterType.ALL,
        })}
      >
        All
      </a>

      <a
        onClick={() => setFilter(FilterType.ACTIVE)}
        href="#/active"
        className={classNames('filter__link', {
          selected: filter === FilterType.ACTIVE,
        })}
      >
        Active
      </a>

      <a
        onClick={() => setFilter(FilterType.COMPLETED)}
        href="#/completed"
        className={classNames('filter__link', {
          selected: filter === FilterType.COMPLETED,
        })}
      >
        Completed
      </a>
    </nav>
  );
};
