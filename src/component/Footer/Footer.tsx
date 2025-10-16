import React from 'react';
import cn from 'classnames';
import { FilterType } from '../../types/filterType';

type Props = {
  hasCompletedTodo?: boolean;
  itemLeft: number;
  stateTodo: string;
  setStateTodo: (state: string) => void;
  clearComplete: () => void;
};

export const Footer: React.FC<Props> = ({
  itemLeft,
  stateTodo,
  hasCompletedTodo = false,
  setStateTodo,
  clearComplete,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {itemLeft} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: !stateTodo,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setStateTodo(FilterType.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: stateTodo === FilterType.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setStateTodo(FilterType.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: stateTodo === FilterType.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setStateTodo(FilterType.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompletedTodo}
        onClick={clearComplete}
      >
        Clear completed
      </button>
    </footer>
  );
};
