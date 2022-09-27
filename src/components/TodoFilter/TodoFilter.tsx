import classNames from 'classnames';
import React from 'react';

import { Filter } from '../../types/Filter';

type Props = {
  setFilter: React.Dispatch<React.SetStateAction<Filter>>,
  filter: Filter,
};

export const TodoFilter: React.FC<Props> = ({ setFilter, filter }) => (

  <nav className="filter" data-cy="Filter">
    <a
      data-cy="FilterLinkAll"
      href="#/"
      className={classNames('filter__link', {
        selected: filter === Filter.all,
      })}
      onClick={() => {
        setFilter(Filter.all);
      }}
    >
      All
    </a>

    <a
      data-cy="FilterLinkActive"
      href="#/active"
      className={classNames('filter__link', {
        selected: filter === Filter.active,
      })}
      onClick={() => {
        setFilter(Filter.active);
      }}
    >
      Active
    </a>
    <a
      data-cy="FilterLinkCompleted"
      href="#/completed"
      className={classNames('filter__link', {
        selected: filter === Filter.completed,
      })}
      onClick={() => {
        setFilter(Filter.completed);
      }}
    >
      Completed
    </a>
  </nav>
);
