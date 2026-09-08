import React from 'react';
import { FilterOption } from './../../types/FilterOption';
import classNames from 'classnames';

interface Props {
  currentFilter: FilterOption;
  onApplyFilter: (filter: FilterOption) => void;
}

export const Filter: React.FC<Props> = ({
  currentFilter = FilterOption.ALL,
  onApplyFilter = () => {},
}) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: currentFilter === FilterOption.ALL,
        })}
        data-cy="FilterLinkAll"
        onClick={() => {
          onApplyFilter(FilterOption.ALL);
        }}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: currentFilter === FilterOption.ACTIVE,
        })}
        data-cy="FilterLinkActive"
        onClick={() => {
          onApplyFilter(FilterOption.ACTIVE);
        }}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: currentFilter === FilterOption.COMPLETED,
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => {
          onApplyFilter(FilterOption.COMPLETED);
        }}
      >
        Completed
      </a>
    </nav>
  );
};
