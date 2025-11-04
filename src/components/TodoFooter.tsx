import React from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { Filter } from '../types/Filter';
/* eslint-disable @typescript-eslint/indent */
type Props = {
  activeCount: number;
  filter: Filter;
  onFilterChange: (value: Filter) => void;
  todos: Todo[];
  handleClearCompleted: () => Promise<void>;
  deletingId: number[];
};
/* eslint-enable @typescript-eslint/indent */
export const TodoFooter: React.FC<Props> = ({
  activeCount,
  filter,
  onFilterChange,
  todos,
  handleClearCompleted,
}) => {
  const hasCompleted = todos.some(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeCount} {activeCount === 1 ? 'item' : 'items'} left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', { selected: filter === Filter.All })}
          data-cy="FilterLinkAll"
          onClick={() => onFilterChange(Filter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', { selected: filter === Filter.Active })}
          data-cy="FilterLinkActive"
          onClick={() => onFilterChange(Filter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', { selected: filter === Filter.Completed })}
          data-cy="FilterLinkCompleted"
          onClick={() => onFilterChange(Filter.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleClearCompleted}
        disabled={!hasCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
