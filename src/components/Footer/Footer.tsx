/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import cn from 'classnames';
import { FilterTypes } from '../../types/FilterTypes';

type Props = {
  completedFilter: string;
  setCompletedFilter: (status: FilterTypes) => void;
  clearCompletedTodos: () => Promise<void>;
  activeTodosAmount: number;
  completedTodosAmount: number;
};

export const Footer: React.FC<Props> = React.memo(
  ({
    completedFilter,
    setCompletedFilter,
    clearCompletedTodos,
    activeTodosAmount,
    completedTodosAmount,
  }) => (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeTodosAmount} item${activeTodosAmount > 1 ? 's' : ''} left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={cn(
            'filter__link',
            { selected: completedFilter === FilterTypes.ALL },
          )}
          onClick={() => setCompletedFilter(FilterTypes.ALL)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={cn(
            'filter__link',
            { selected: completedFilter === FilterTypes.ACTIVE },
          )}
          onClick={() => setCompletedFilter(FilterTypes.ACTIVE)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={cn(
            'filter__link',
            { selected: completedFilter === FilterTypes.COMPLETED },
          )}
          onClick={() => setCompletedFilter(FilterTypes.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={() => clearCompletedTodos()}
        style={{
          visibility: !completedTodosAmount ? 'hidden' : 'visible',
        }}
      >
        Clear completed
      </button>
    </footer>
  ),
);
