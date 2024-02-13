import React, { useContext, useState } from 'react';
import classNames from 'classnames';

import { DispatchContext, StateContext } from '../management/TodoContext';
import { Filter } from '../types/Filter';

export const TodoFilter: React.FC = () => {
  const { filterBy } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const [selectedFilter, setSelectedFilter] = useState(filterBy);

  const handleSelectedFilter = (filter: Filter) => {
    setSelectedFilter(filter);
    dispatch({
      type: 'filter',
      payload: filter,
    });
  };

  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: selectedFilter === Filter.all,
        })}
        data-cy="FilterLinkAll"
        onClick={() => handleSelectedFilter(Filter.all)}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: selectedFilter === Filter.active,
        })}
        data-cy="FilterLinkActive"
        onClick={() => handleSelectedFilter(Filter.active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: selectedFilter === Filter.completed,
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => handleSelectedFilter(Filter.completed)}
      >
        Completed
      </a>
    </nav>
  );
};
