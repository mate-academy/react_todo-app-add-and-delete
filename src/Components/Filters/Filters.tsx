import React, { useContext } from 'react';
import {
  Actions,
  DispatchContext,
  FilterValue,
  StateContext,
} from '../../Store';
import classNames from 'classnames';

export const Filters: React.FC = () => {
  const { filterStatus } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const setFilterActive = (value: string) => {
    dispatch({
      type: Actions.changeTodosStatus,
      filterValue: value,
    });
  };

  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: filterStatus === FilterValue.All,
        })}
        data-cy="FilterLinkAll"
        onClick={() => setFilterActive(FilterValue.All)}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: filterStatus === FilterValue.Active,
        })}
        data-cy="FilterLinkActive"
        onClick={() => setFilterActive(FilterValue.Active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: filterStatus === FilterValue.Completed,
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => setFilterActive(FilterValue.Completed)}
      >
        Completed
      </a>
    </nav>
  );
};
