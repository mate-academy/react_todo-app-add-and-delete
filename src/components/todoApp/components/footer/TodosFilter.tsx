import React, { useContext } from 'react';
import cn from 'classnames';
import { DispatchContext, TodosContext } from '../../../../Store';
import { Status } from '../../../../types/Status';

export const TodosFilter: React.FC = () => {
  const { filterBy } = useContext(TodosContext);
  const dispatch = useContext(DispatchContext);

  const filters = (filter: Status) => {
    dispatch({
      type: 'filter',
      payload: filter,
    });
  };

  return (
    <nav className="filter" data-cy="Filter">
      <a
        data-cy="FilterLinkAll"
        href="#/"
        className={cn('filter__link', { selected: filterBy === Status.ALL })}
        onClick={() => filters(Status.ALL)}
      >
        All
      </a>
      <a
        data-cy="FilterLinkActive"
        href="#/active"
        className={cn('filter__link', { selected: filterBy === Status.ACTIVE })}
        onClick={() => filters(Status.ACTIVE)}
      >
        Active
      </a>

      <a
        data-cy="FilterLinkCompleted"
        href="#/completed"
        className={cn('filter__link', {
          selected: filterBy === Status.COMPLETED,
        })}
        onClick={() => filters(Status.COMPLETED)}
      >
        Completed
      </a>
    </nav>
  );
};
