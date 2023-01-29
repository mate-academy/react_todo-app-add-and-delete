import React from 'react';
import { Filter } from '../../types/Filter';

type Props = {
  complitedFilter: Filter;
  changecomplitedFilter: (prop: Filter) => void;
  activeTodosNum: number;
};

export const TodosFooter: React.FC<Props> = ({
  complitedFilter,
  changecomplitedFilter,
  activeTodosNum,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeTodosNum} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={
            `filter__link ${complitedFilter === Filter.All && 'selected'}`
          }
          onClick={() => changecomplitedFilter(Filter.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={
            `filter__link ${complitedFilter === Filter.Active && 'selected'}`
          }
          onClick={() => changecomplitedFilter(Filter.Active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={
            `filter__link ${complitedFilter === Filter.Completed && 'selected'}`
          }
          onClick={() => changecomplitedFilter(Filter.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
      >
        Clear completed
      </button>
    </footer>
  );
};
