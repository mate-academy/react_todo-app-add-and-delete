import React from 'react';
import { Filter } from '../types/Filter';
import cn from 'classnames';

interface Props {
  todos: number;
  setFilter: (fil: Filter) => void;
  filter: Filter;
  todosCompleted: number;
  onClearCompleted: () => Promise<void>;
}

export const TodoFooter: React.FC<Props> = ({
  filter,
  setFilter,
  todos,
  onClearCompleted,
  todosCompleted,
}) => {
  const isCompletedTodos = todosCompleted === 0;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todos} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', { selected: filter === Filter.All })}
          data-cy="FilterLinkAll"
          onClick={() => setFilter(Filter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          data-cy="FilterLinkActive"
          className={cn('filter__link', { selected: filter === Filter.Active })}
          onClick={() => setFilter(Filter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          data-cy="FilterLinkCompleted"
          className={cn('filter__link', {
            selected: filter === Filter.Completed,
          })}
          onClick={() => setFilter(Filter.Completed)}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onClearCompleted}
        disabled={isCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
