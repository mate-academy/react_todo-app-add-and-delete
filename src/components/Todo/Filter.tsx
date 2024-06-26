import classNames from 'classnames';
import { useTodoFilter, useTodoApi } from './Context';
import React from 'react';
import { FilterOption } from '../../types/types';

export const Filter: React.FC = () => {
  const filter = useTodoFilter();
  const { handleFilterChange } = useTodoApi();

  const chooseFilter = (newFilter: FilterOption) => {
    if (filter !== newFilter) {
      handleFilterChange(newFilter);
    }
  };

  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={classNames('filter__link', { selected: filter === 'All' })}
        data-cy="FilterLinkAll"
        onClick={() => chooseFilter('All')}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: filter === 'Active',
        })}
        data-cy="FilterLinkActive"
        onClick={() => chooseFilter('Active')}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: filter === 'Completed',
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => chooseFilter('Completed')}
      >
        Completed
      </a>
    </nav>
  );
};
