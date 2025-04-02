import classNames from 'classnames';
import { FilterStatus } from '../types/Todo';
import React from 'react';

type Props = {
  todoStatus: FilterStatus;
  handleFilterChange: (newTodoStatus: FilterStatus) => void;
};

export const Filter: React.FC<Props> = ({
  todoStatus,
  handleFilterChange,
}: Props) => (
  <nav className="filter" data-cy="Filter">
    <a
      href="#/"
      className={classNames('filter__link', {
        selected: todoStatus === FilterStatus.ALL,
      })}
      data-cy="FilterLinkAll"
      onClick={() => handleFilterChange(FilterStatus.ALL)}
    >
      {FilterStatus.ALL}
    </a>

    <a
      href="#/active"
      className={classNames('filter__link', {
        selected: todoStatus === FilterStatus.ACTIVE,
      })}
      data-cy="FilterLinkActive"
      onClick={() => handleFilterChange(FilterStatus.ACTIVE)}
    >
      {FilterStatus.ACTIVE}
    </a>

    <a
      href="#/completed"
      className={classNames('filter__link', {
        selected: todoStatus === FilterStatus.COMPLETED,
      })}
      data-cy="FilterLinkCompleted"
      onClick={() => handleFilterChange(FilterStatus.COMPLETED)}
    >
      {FilterStatus.COMPLETED}
    </a>
  </nav>
);
