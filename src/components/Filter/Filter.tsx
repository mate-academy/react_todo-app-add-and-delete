import { useContext } from 'react';
import { DispatchContext, StateContext } from '../../store/Store';
import classNames from 'classnames';
import { FilterBy } from '../../enums/FilterBy';

export const Filter = () => {
  const { sortBy } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const handleShowAll = () => {
    dispatch({ type: 'SHOW_ALL' });
  };

  const handleShowCompleted = () => {
    dispatch({ type: 'SHOW_COMPLETED' });
  };

  const handleShowActive = () => {
    dispatch({ type: 'SHOW_ACTIVE' });
  };

  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        onClick={handleShowAll}
        className={classNames('filter__link', {
          selected: sortBy === FilterBy.All,
        })}
        data-cy="FilterLinkAll"
      >
        All
      </a>

      <a
        href="#/active"
        onClick={handleShowActive}
        className={classNames('filter__link', {
          selected: sortBy === FilterBy.Active,
        })}
        data-cy="FilterLinkActive"
      >
        Active
      </a>

      <a
        href="#/completed"
        onClick={handleShowCompleted}
        className={classNames('filter__link', {
          selected: sortBy === FilterBy.Completed,
        })}
        data-cy="FilterLinkCompleted"
      >
        Completed
      </a>
    </nav>
  );
};
