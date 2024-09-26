import React from 'react';
import cn from 'classnames';
import { Filter } from '../../types/Filter';

type Props = {
  currentFilter: Filter;
  setFilter: React.Dispatch<React.SetStateAction<Filter>>;
  itemsLeft: number;
  handleClearCompletedTodo: () => void;
  hasCompleted: boolean;
};

export const Footer: React.FC<Props> = ({
  setFilter,
  itemsLeft,
  currentFilter,
  handleClearCompletedTodo,
  hasCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${itemsLeft} items left`}
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: currentFilter === Filter.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilter(Filter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: currentFilter === Filter.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilter(Filter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: currentFilter === Filter.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter(Filter.Completed)}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        onClick={handleClearCompletedTodo}
        type="button"
        className="todoapp__clear-completed"
        disabled={!hasCompleted}
        data-cy="ClearCompletedButton"
      >
        Clear completed
      </button>
    </footer>
  );
};
