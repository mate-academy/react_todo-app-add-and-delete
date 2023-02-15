import React from 'react';
import cn from 'classnames';
import { FilterBy } from '../../types/FilterBy';

type Props = {
  quantity: number,
  filterBy: FilterBy,
  setFilterBy: (filter: FilterBy) => void,
  onRemoveCompletedTodo: () => void,
  hasCompletedTodos: boolean,
};

export const Footer: React.FC<Props> = React.memo(({
  quantity,
  filterBy,
  setFilterBy,
  onRemoveCompletedTodo,
  hasCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${quantity} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: filterBy === FilterBy.ALL,
          })}
          onClick={() => setFilterBy(FilterBy.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filterBy === FilterBy.ACTIVE,
          })}
          onClick={() => setFilterBy(FilterBy.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filterBy === FilterBy.COMPLETED,
          })}
          onClick={() => setFilterBy(FilterBy.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={onRemoveCompletedTodo}
        disabled={!hasCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
});
