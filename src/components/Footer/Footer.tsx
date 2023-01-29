import React, { memo } from 'react';
import cn from 'classnames';

export enum Filters {
  ALL = 'all',
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

type FooterProps = {
  filter: Filters,
  activeTodos: number,
  onChange: (arg: Filters) => void
};

export const Footer: React.FC<FooterProps> = memo(({
  filter,
  activeTodos: activeTodosCount,
  onChange,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="todosCounter">
      {`${activeTodosCount} item${activeTodosCount > 1 ? 's' : ''} left`}
    </span>

    <nav className="filter" data-cy="Filter">
      <a
        data-cy="FilterLinkAll"
        href="#/"
        className={cn(
          'filter__link', {
            selected: filter === Filters.ALL,
          },
        )}
        onClick={() => onChange(Filters.ALL)}
      >
        All
      </a>

      <a
        data-cy="FilterLinkActive"
        href="#/active"
        className={cn(
          'filter__link', {
            selected: filter === Filters.ACTIVE,
          },
        )}
        onClick={() => onChange(Filters.ACTIVE)}
      >
        Active
      </a>

      <a
        data-cy="FilterLinkCompleted"
        href="#/completed"
        className={cn(
          'filter__link', {
            selected: filter === Filters.COMPLETED,
          },
        )}
        onClick={() => onChange(Filters.COMPLETED)}
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
));
