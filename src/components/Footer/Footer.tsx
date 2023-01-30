import React, { memo } from 'react';
import cn from 'classnames';
import { FilterType } from '../../types/FilterType';

type Props = {
  activeTodosQuantity: number,
  filterType: FilterType,
  setFilterTodo: (str: FilterType) => void,
  clearCompletedTodos: () => void,
  completedTodosQuantity: number
};

export const Footer: React.FC<Props> = memo(({
  activeTodosQuantity,
  filterType,
  setFilterTodo,
  clearCompletedTodos,
  completedTodosQuantity,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeTodosQuantity} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={cn('filter__link', {
            selected: filterType === FilterType.ALL,
          })}
          onClick={() => setFilterTodo(FilterType.ALL)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={cn('filter__link', {
            selected: filterType === FilterType.ACTIVE,
          })}
          onClick={() => setFilterTodo(FilterType.ACTIVE)}
        >
          Active
        </a>

        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={cn('filter__link', {
            selected: filterType === FilterType.COMPLETED,
          })}
          onClick={() => setFilterTodo(FilterType.COMPLETED)}
        >
          Completed
        </a>
      </nav>
      <button
        data-cy="ClearCompletedButton"
        type="button"
        className={cn('todoapp__clear-completed', {
          'is-invisible': !completedTodosQuantity,
        })}
        onClick={clearCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
});
