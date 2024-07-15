import React from 'react';
import { Filters } from '../../types/Filter/Filter';
import cn from 'classnames';
import { Todo } from '../../types/Todo/Todo';
import { getActiveTodos } from '../../Service/isActiveTodos';

interface Props {
  filter: Filters;
  setFilter: (filterBy: Filters) => void;
  todos: Todo[];
  onClear: () => void;
}

export const TodoFiler: React.FC<Props> = ({
  filter,
  setFilter,
  todos,
  onClear,
}) => {
  const isOneCompleted = (todoss: Todo[]) =>
    todoss.some(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {getActiveTodos(todos).length} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: filter === Filters.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilter(Filters.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filter === Filters.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilter(Filters.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filter === Filters.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter(Filters.Completed)}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!isOneCompleted(todos)}
        onClick={() => onClear()}
      >
        Clear completed
      </button>
    </footer>
  );
};
