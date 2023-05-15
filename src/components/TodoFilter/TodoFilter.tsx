import React from 'react';
import classNames from 'classnames';
import { FilterBy } from '../../types/FilterBy';

interface Props {
  typeFilter: FilterBy;
  onChangeFilter: (type: FilterBy) => void;
}

export const TodoFilter: React.FC<Props> = ({ typeFilter, onChangeFilter }) => (
  <nav className="filter">
    <a
      href="#/"
      className={classNames('filter__link', {
        selected: typeFilter === FilterBy.ALL,
      })}
      onClick={() => onChangeFilter(FilterBy.ALL)}
    >
      All
    </a>

    <a
      href="#/active"
      className={classNames('filter__link', {
        selected: typeFilter === FilterBy.ACTIVE,
      })}
      onClick={() => onChangeFilter(FilterBy.ACTIVE)}
    >
      Active
    </a>

    <a
      href="#/completed"
      className={classNames('filter__link', {
        selected: typeFilter === FilterBy.COMPLETED,
      })}
      onClick={() => onChangeFilter(FilterBy.COMPLETED)}
    >
      Completed
    </a>
  </nav>
);
