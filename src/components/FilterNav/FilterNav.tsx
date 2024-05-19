import cn from 'classnames';
import { useContext } from 'react';
import { DispatchContex, StateContex } from '../../Store';
import { Filter } from '../../types/Filter';

export const FilterNav = () => {
  const { filter } = useContext(StateContex);
  const dispatch = useContext(DispatchContex);

  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={cn('filter__link', { selected: filter === Filter.ALL })}
        data-cy="FilterLinkAll"
        onClick={() => dispatch({ type: 'set-filter', payload: Filter.ALL })}
      >
        All
      </a>

      <a
        href="#/active"
        className={cn('filter__link', { selected: filter === Filter.ACTIVE })}
        data-cy="FilterLinkActive"
        onClick={() => dispatch({ type: 'set-filter', payload: Filter.ACTIVE })}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={cn('filter__link', {
          selected: filter === Filter.COMPLETED,
        })}
        data-cy="FilterLinkCompleted"
        onClick={() =>
          dispatch({ type: 'set-filter', payload: Filter.COMPLETED })
        }
      >
        Completed
      </a>
    </nav>
  );
};
