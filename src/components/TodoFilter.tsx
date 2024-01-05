import React from 'react';
import classNames from 'classnames';
import { Filter } from '../types/Filter';

type Props = {
  setFilter: (value: Filter) => void,
  filter: Filter,

};

export const TodoFilter: React.FC<Props> = ({
  setFilter,
  filter,
}) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: Filter.all === filter,
        })}
        onClick={() => setFilter(Filter.all)}
        data-cy="FilterLinkAll"
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: Filter.active === filter,
        })}
        onClick={() => setFilter(Filter.active)}
        data-cy="FilterLinkActive"
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: Filter.completed === filter,
        })}
        onClick={() => setFilter(Filter.completed)}
        data-cy="FilterLinkCompleted"
      >
        Completed
      </a>
    </nav>
  );
};
