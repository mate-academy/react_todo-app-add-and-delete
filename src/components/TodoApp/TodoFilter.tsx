import React, { useContext, useState } from 'react';

import cn from 'classnames';
import { Filter } from '../../types/Filter';
import { DispatchContext, StateContext } from '../Context/StateContext';

export const TodoFilter: React.FC = () => {
  const { filterType } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const [selectedFilter, setSelectedFilter] = useState(filterType);

  const handlerSelectedFilter = (filter: Filter) => {
    setSelectedFilter(filter);

    dispatch({
      type: 'filter',
      filterType: filter,
    });
  };

  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={cn('filter__link', {
          selected: selectedFilter === Filter.ALL,
        })}
        data-cy="FilterLinkAll"
        onClick={() => handlerSelectedFilter(Filter.ALL)}
      >
        All
      </a>

      <a
        href="#/active"
        className={cn('filter__link', {
          selected: selectedFilter === Filter.ACTIVE,
        })}
        data-cy="FilterLinkActive"
        onClick={() => handlerSelectedFilter(Filter.ACTIVE)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={cn('filter__link', {
          selected: selectedFilter === Filter.COMPLETED,
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => handlerSelectedFilter(Filter.COMPLETED)}
      >
        Completed
      </a>
    </nav>
  );
};
