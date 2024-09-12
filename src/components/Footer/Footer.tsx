import React, { memo } from 'react';
import cn from 'classnames';

import { FilterStatus } from '../../types/FilterStatus';
import { Todo } from '../../types/Todo';

import './Footer.scss';

type Props = {
  sortedTodos: {
    active: Todo[];
    completed: Todo[];
  };
  filterStatus: FilterStatus;
  onStatusChange: (newStatus: FilterStatus) => void;
  onCompletedDelete: (ids: number[]) => void;
};

export const Footer: React.FC<Props> = memo(function Footer({
  sortedTodos,
  filterStatus,
  onStatusChange,
  onCompletedDelete,
}) {
  const { active, completed } = sortedTodos;

  return (
    <footer className="Footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${active.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: filterStatus === FilterStatus.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => {
            onStatusChange(FilterStatus.All);
          }}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filterStatus === FilterStatus.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => {
            onStatusChange(FilterStatus.Active);
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filterStatus === FilterStatus.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => {
            onStatusChange(FilterStatus.Completed);
          }}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={() => {
          onCompletedDelete(completed.map(({ id }) => id));
        }}
        disabled={!completed.length}
      >
        Clear completed
      </button>
    </footer>
  );
});
