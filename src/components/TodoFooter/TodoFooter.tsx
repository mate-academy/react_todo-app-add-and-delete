import classNames from 'classnames';
import React from 'react';
import { FilterOption } from '../../types/FilterOption';

type Props = {
  activeTodosCount: number;
  completedTodosCount: number;
  selectedFilter: FilterOption;
  onFilterChange: (option: FilterOption) => void;
  onClearCompleted: () => void;
};

export const TodoFooter: React.FC<Props> = ({
  activeTodosCount,
  completedTodosCount,
  selectedFilter,
  onFilterChange,
  onClearCompleted,
}) => {
  const cnFilter = (option: FilterOption) =>
    classNames('filter__link', { selected: selectedFilter === option });

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount === 1
          ? '1 item left'
          : `${activeTodosCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cnFilter(FilterOption.All)}
          data-cy="FilterLinkAll"
          onClick={() => onFilterChange(FilterOption.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cnFilter(FilterOption.Active)}
          data-cy="FilterLinkActive"
          onClick={() => onFilterChange(FilterOption.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cnFilter(FilterOption.Completed)}
          data-cy="FilterLinkCompleted"
          onClick={() => onFilterChange(FilterOption.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onClearCompleted}
        disabled={completedTodosCount <= 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
