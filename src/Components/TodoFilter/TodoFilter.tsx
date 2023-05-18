import React from 'react';
import classNames from 'classnames';
import { FilterType } from '../../types/FilterType';

type Props = {
  filter: FilterType;
  setFilter: (newSort: FilterType) => void;
};

export const TodoFilter: React.FC<Props> = ({ filter, setFilter }) => {
  return (
    <nav className="filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: filter === FilterType.All,
        })}
        onClick={() => setFilter(FilterType.All)}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: filter === FilterType.Active,
        })}
        onClick={() => setFilter(FilterType.Active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: filter === FilterType.Completed,
        })}
        onClick={() => setFilter(FilterType.Completed)}
      >
        Completed
      </a>
    </nav>
  );
};
