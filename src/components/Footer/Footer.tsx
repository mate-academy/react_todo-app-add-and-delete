import React, { memo } from 'react';
import cn from 'classnames';
import { FilterType } from '../../types/FilterType';

type Props = {
  activeTodosQuantity: number,
  filterType: FilterType,
  handleFilterChange: (str: FilterType) => void,
  onDeleteComplited: () => void,
  completedTodosQuantity: number
};

export const Footer: React.FC<Props> = memo(({
  activeTodosQuantity,
  filterType,
  handleFilterChange,
  onDeleteComplited,
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
            selected: filterType === FilterType.all,
          })}
          onClick={() => handleFilterChange(FilterType.all)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={cn('filter__link', {
            selected: filterType === FilterType.active,
          })}
          onClick={() => handleFilterChange(FilterType.active)}
        >
          Active
        </a>

        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={cn('filter__link', {
            selected: filterType === FilterType.completed,
          })}
          onClick={() => handleFilterChange(FilterType.completed)}
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
        onClick={onDeleteComplited}
      >
        Clear completed
      </button>
    </footer>
  );
});
