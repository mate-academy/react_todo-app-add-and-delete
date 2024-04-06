import React, { useState, useContext } from 'react';
import cn from 'classnames';
import { Filter } from '../types/Types';
import { DispatchContext, StateContext } from '../managment/TodoContext';

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
    <nav className="filters" data-cy="Filter">
      <a
        href="#/"
        className={cn('filter__link', {
          selected: selectedFilter === Filter.All,
        })}
        onClick={() => handleSelectedFilter(Filter.All)}
      >
        All
      </a>

      <a
        href="#/active"
        className={cn('filter__link', {
          selected: selectedFilter === Filter.Active,
        })}
        onClick={() => handleSelectedFilter(Filter.Active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={cn('filter__link', {
          selected: selectedFilter === Filter.Completed,
        })}
        onClick={() => handleSelectedFilter(Filter.Completed)}
      >
        Completed
      </a>
    </nav>
  );
};
