import cn from 'classnames';
import React, { Dispatch, SetStateAction } from 'react';
import { FilterStatus } from '../../types/FilterStatus';

type Props = {
  activeTodosCount: number;
  setFilterStatus: Dispatch<SetStateAction<FilterStatus>>;
  filterStatus: FilterStatus,
  deleteCompletedTodos: () => void;
  completedTodosCount: number;
};

export const Footer:React.FC<Props> = ({
  activeTodosCount,
  setFilterStatus,
  filterStatus,
  deleteCompletedTodos,
  completedTodosCount,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeTodosCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={cn('filter__link',
            { selected: filterStatus === FilterStatus.All })}
          onClick={() => setFilterStatus(FilterStatus.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={cn('filter__link',
            { selected: filterStatus === FilterStatus.Active })}
          onClick={() => setFilterStatus(FilterStatus.Active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={cn('filter__link',
            { selected: filterStatus === FilterStatus.Completed })}
          onClick={() => setFilterStatus(FilterStatus.Completed)}
        >
          Completed
        </a>

      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={() => deleteCompletedTodos()}
        style={{
          visibility: completedTodosCount
            ? 'visible'
            : 'hidden',
        }}
      >
        Clear completed
      </button>
    </footer>
  );
};
