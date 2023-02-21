import React from 'react';
import cn from 'classnames';
import { SortType } from '../../types/SortType';

interface Props {
  activeTodosAmount: number;
  onSort: (sortType: SortType) => void;
  sortType: SortType;
  onClearCompletedTodos: () => void;
  isCompletedTodo: boolean;
}
export const Footer: React.FC<Props> = ({
  activeTodosAmount,
  onSort,
  sortType,
  onClearCompletedTodos,
  isCompletedTodo,
}) => (
  <footer className="todoapp__footer">
    <span className="todo-count">
      {`${activeTodosAmount} items left`}
    </span>

    {/* Active filter should have a 'selected' class */}
    <nav className="filter">
      <a
        href="#/"
        className={cn('filter__link', {
          selected: sortType === SortType.ALL,
        })}
        onClick={() => onSort(SortType.ALL)}
      >
        All
      </a>

      <a
        href="#/active"
        className={cn('filter__link', {
          selected: sortType === SortType.ACTIVE,
        })}
        onClick={() => onSort(SortType.ACTIVE)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={cn('filter__link', {
          selected: sortType === SortType.COMPLETED,
        })}
        onClick={() => onSort(SortType.COMPLETED)}
      >
        Completed
      </a>
    </nav>

    <button
      type="button"
      className={cn(
        'todoapp__clear-completed',
        { 'todoapp__clear-completed-hidden': !isCompletedTodo },
      )}
      onClick={onClearCompletedTodos}
    >
      Clear completed
    </button>
  </footer>
);
