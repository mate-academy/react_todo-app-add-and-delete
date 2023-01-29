/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import cn from 'classnames';
import { FilterType } from '../../types/FilterType';

type Props = {
  completedFilter: string;
  setCompletedFilter: (status: FilterType) => void;
  deleteAllCompleted: () => Promise<void>;
  activeTodosAmount: number;
  completedTodosAmount: number;
};

export const Footer: React.FC<Props> = React.memo(
  ({
    completedFilter,
    setCompletedFilter,
    deleteAllCompleted,
    activeTodosAmount,
    completedTodosAmount,
  }) => {
    return (
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
              { selected: completedFilter === FilterType.ALL },
            )}
            onClick={() => setCompletedFilter(FilterType.ALL)}
          >
            All
          </a>

          <a
            data-cy="FilterLinkActive"
            href="#/active"
            className={cn(
              'filter__link',
              { selected: completedFilter === FilterType.ACTIVE },
            )}
            onClick={() => setCompletedFilter(FilterType.ACTIVE)}
          >
            Active
          </a>
          <a
            data-cy="FilterLinkCompleted"
            href="#/completed"
            className={cn(
              'filter__link',
              { selected: completedFilter === FilterType.COMPLETED },
            )}
            onClick={() => setCompletedFilter(FilterType.COMPLETED)}
          >
            Completed
          </a>
        </nav>

        <button
          data-cy="ClearCompletedButton"
          type="button"
          className="todoapp__clear-completed"
          onClick={() => deleteAllCompleted()}
          style={{
            visibility: !completedTodosAmount ? 'hidden' : 'visible',
          }}
        >
          Clear completed
        </button>
      </footer>
    );
  },
);
