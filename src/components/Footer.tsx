import React, { useCallback, useContext } from 'react';

import cn from 'classnames';

import { FilterStatus } from '../types/FilterStatus';

import { StateContext, DispatchContext } from '../store/TodoContext';
import { ActionType } from '../types/Actions';

export const Footer: React.FC = () => {
  const { todos, filterStatus } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const completedTodos = todos.filter(todo => todo.completed);
  const activeTodos = todos.filter(todo => !todo.completed);

  const onFilterChange = useCallback(
    (filter: FilterStatus) => {
      dispatch({ type: ActionType.SetFilter, payload: filter });
    },
    [dispatch],
  );

  function handleClearCompleted() {
    dispatch({ type: ActionType.SetTodos, payload: activeTodos });
  }

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      {todos.length > 0 && (
        <span className="todo-count" data-cy="TodosCounter">
          {`${activeTodos.length} items left`}
        </span>
      )}

      <nav className="filter" data-cy="Filter">
        <a
          href="/#"
          className={cn('filter__link', {
            selected: filterStatus === FilterStatus.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => onFilterChange(FilterStatus.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filterStatus === FilterStatus.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => onFilterChange(FilterStatus.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filterStatus === FilterStatus.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => onFilterChange(FilterStatus.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleClearCompleted}
        disabled={completedTodos.length === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
