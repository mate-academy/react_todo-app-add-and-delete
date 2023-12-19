import React, { Dispatch, SetStateAction } from 'react';
import cn from 'classnames';
import { FilterType } from '../../types/FilterType';

type Props = {
  activeTodosCount: number,
  isAnyTodoCompleted: boolean,
  selectedFilter: FilterType,
  setSelectedFilter: Dispatch<SetStateAction<FilterType>>,
  onClearCompleted: () => void,
};

export const TodoFooter: React.FC<Props> = ({
  activeTodosCount,
  isAnyTodoCompleted,
  selectedFilter,
  setSelectedFilter,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodosCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: selectedFilter === FilterType.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setSelectedFilter(FilterType.All)}
        >
          {FilterType.All}
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: selectedFilter === FilterType.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setSelectedFilter(FilterType.Active)}
        >
          {FilterType.Active}
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: selectedFilter === FilterType.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setSelectedFilter(FilterType.Completed)}
        >
          {FilterType.Completed}
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!isAnyTodoCompleted}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
