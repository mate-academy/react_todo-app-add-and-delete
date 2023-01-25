import React, { memo } from 'react';
import cn from 'classnames';
import { FilterType } from '../../types/FiltersType';

type Props = {
  activeTodos: number;
  completedFilter: FilterType;
  onChangeType: (str: FilterType) => void;
  completedTodos: number;
  onDeleteComplited: () => void;
};

export const Footer: React.FC<Props> = memo(({
  activeTodos,
  completedFilter,
  onChangeType,
  completedTodos,
  onDeleteComplited,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeTodos} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={cn('filter__link', {
            selected: completedFilter === FilterType.all,
          })}
          onClick={() => onChangeType(FilterType.all)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={cn('filter__link', {
            selected: completedFilter === FilterType.active,
          })}
          onClick={() => onChangeType(FilterType.active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={cn('filter__link', {
            selected: completedFilter === FilterType.completed,
          })}
          onClick={() => onChangeType(FilterType.completed)}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        disabled={completedTodos === 0}
        onClick={onDeleteComplited}
      >
        Clear completed
      </button>
    </footer>
  );
});
