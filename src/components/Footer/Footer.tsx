import React, { memo } from 'react';
import cn from 'classnames';

import { FilterStatus } from '../../types/FilterStatus';

type Props = {
  activeTodosAmount: number;
  isCompletedTodos: boolean;
  filterStatus: FilterStatus;
  setFilterStatus: React.Dispatch<React.SetStateAction<FilterStatus>>;
  removeCompletedTodos: () => void;
};

export const Footer: React.FC<Props> = memo((props) => {
  const {
    activeTodosAmount,
    isCompletedTodos,
    filterStatus,
    setFilterStatus: changeFilterStatus,
    removeCompletedTodos: onDeleteCompletedTodos,
  } = props;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeTodosAmount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={cn('filter__link', {
            selected: filterStatus === FilterStatus.All,
          })}
          onClick={() => changeFilterStatus(FilterStatus.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={cn('filter__link', {
            selected: filterStatus === FilterStatus.Active,
          })}
          onClick={() => changeFilterStatus(FilterStatus.Active)}
        >
          Active
        </a>

        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={cn('filter__link', {
            selected: filterStatus === FilterStatus.Completed,
          })}
          onClick={() => changeFilterStatus(FilterStatus.Completed)}
        >
          Completed
        </a>
      </nav>

      {isCompletedTodos && (
        <button
          data-cy="ClearCompletedButton"
          type="button"
          className="todoapp__clear-completed"
          onClick={onDeleteCompletedTodos}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
});
