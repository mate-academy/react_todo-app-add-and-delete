import cn from 'classnames';
import { useContext } from 'react';
import { Filter } from '../../types/Filter';
import { DispatchContext, StateContext } from '../../utils/GlobalStateProvider';

export const TodoFilter = () => {
  const { filter } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={cn('filter__link', {
          selected: Filter.all === filter,
        })}
        data-cy="FilterLinkAll"
        onClick={() => dispatch({ type: 'setFilter', payload: Filter.all })}
      >
        All
      </a>

      <a
        href="#/active"
        className={cn('filter__link', {
          selected: Filter.active === filter,
        })}
        data-cy="FilterLinkActive"
        onClick={() => dispatch({ type: 'setFilter', payload: Filter.active })}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={cn('filter__link', {
          selected: Filter.completed === filter,
        })}
        data-cy="FilterLinkCompleted"
        onClick={() =>
          dispatch({ type: 'setFilter', payload: Filter.completed })
        }
      >
        Completed
      </a>
    </nav>
  );
};
