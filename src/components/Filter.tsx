import cn from 'classnames';
import React, { useContext } from 'react';
import { DispatchContext, StateContext } from './TodosContext';
import { Status } from '../types/Status';

export const Filter: React.FC = () => {
  const { filterBy } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const setFilter = (filter: Status) => {
    dispatch({
      type: 'setFilter',
      payload: filter,
    });
  };

  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={cn('filter__link', { selected: filterBy === Status.ALL })}
        data-cy="FilterLinkAll"
        onClick={() => setFilter(Status.ALL)}
      >
        All
      </a>

      <a
        href="#/active"
        className={cn('filter__link', { selected: filterBy === Status.ACTIVE })}
        data-cy="FilterLinkActive"
        onClick={() => setFilter(Status.ACTIVE)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={cn('filter__link', {
          selected: filterBy === Status.COMPLETED,
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => setFilter(Status.COMPLETED)}
      >
        Completed
      </a>
    </nav>
  );
};
