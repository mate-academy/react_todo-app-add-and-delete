import React from 'react';
import classNames from 'classnames';
import { FilterType } from '../types/filterType';

type Props = {
  filterType: string;
  onFilterClick: (type: FilterType) => void;
};

export const Filter: React.FC<Props> = ({ filterType, onFilterClick }) => {
  return (
    <>
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filterType === FilterType.all,
          })}
          data-cy="FilterLinkAll"
          onClick={() => onFilterClick(FilterType.all)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filterType === FilterType.active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => onFilterClick(FilterType.active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filterType === FilterType.completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => onFilterClick(FilterType.completed)}
        >
          Completed
        </a>
      </nav>
    </>
  );
};
