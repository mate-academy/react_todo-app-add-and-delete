import React from 'react';
import cn from 'classnames';
import { FilterStatus } from '../../types/FilterStatus';

type Props = {
  filterTodos: (filterBy: FilterStatus) => void;
  filterStatus: FilterStatus,
  countOfLeftTodos: number,
  deleteAllCompletedTodos: () => void,
};

export const TodoFooter:React.FC<Props> = React.memo(({
  filterTodos,
  filterStatus,
  countOfLeftTodos,
  deleteAllCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${countOfLeftTodos} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={cn('filter__link', {
            selected: filterStatus === FilterStatus.All,
          })}
          onClick={() => filterTodos(FilterStatus.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={cn('filter__link', {
            selected: filterStatus === FilterStatus.Active,
          })}
          onClick={() => filterTodos(FilterStatus.Active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={cn('filter__link', {
            selected: filterStatus === FilterStatus.Completed,
          })}
          onClick={() => filterTodos(FilterStatus.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={deleteAllCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
});
