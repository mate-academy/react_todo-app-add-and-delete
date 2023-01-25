import React, { memo } from 'react';
import cn from 'classnames';
import { Filter } from '../../types/Filter';

type Props = {
  activeTodos: number,
  status: string
  setStatus:(status: Filter) => void
};

export const Footer: React.FC<Props> = memo(({
  activeTodos,
  status,
  setStatus,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {activeTodos > 1
          ? (`${activeTodos} items left`)
          : (`${activeTodos} item left`)}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={cn('filter__link', {
            selected: status === Filter.All,
          })}
          onClick={() => setStatus(Filter.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={cn('filter__link', {
            selected: status === Filter.Active,
          })}
          onClick={() => setStatus(Filter.Active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={cn('filter__link', {
            selected: status === Filter.Completed,
          })}
          onClick={() => setStatus(Filter.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
      >
        Clear completed
      </button>
    </footer>
  );
});
