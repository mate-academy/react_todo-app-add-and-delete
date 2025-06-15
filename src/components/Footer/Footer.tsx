import React from 'react';
import { TodoFilter } from '../../types/Filters';
import cn from 'classnames';

type Props = {
  activeTodosCount: number;
  filter: TodoFilter;
  setFilter: (filter: TodoFilter) => void;
  hasCompletedTodos: boolean;
  clearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  activeTodosCount,
  filter,
  setFilter,
  hasCompletedTodos,
  clearCompleted,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="TodosCounter">
      {activeTodosCount} item{activeTodosCount !== 1 && 's'} left
    </span>

    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={cn('filter__link', { selected: filter === TodoFilter.All })}
        data-cy="FilterLinkAll"
        onClick={e => {
          e.preventDefault();
          setFilter(TodoFilter.All);
        }}
      >
        All
      </a>

      <a
        href="#/active"
        className={cn('filter__link', {
          selected: filter === TodoFilter.Active,
        })}
        data-cy="FilterLinkActive"
        onClick={e => {
          e.preventDefault();
          setFilter(TodoFilter.Active);
        }}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={cn('filter__link', {
          selected: filter === TodoFilter.Completed,
        })}
        data-cy="FilterLinkCompleted"
        onClick={e => {
          e.preventDefault();
          setFilter(TodoFilter.Completed);
        }}
      >
        Completed
      </a>
    </nav>

    <button
      type="button"
      className="todoapp__clear-completed"
      data-cy="ClearCompletedButton"
      onClick={clearCompleted}
      disabled={!hasCompletedTodos}
    >
      Clear completed
    </button>
  </footer>
);
