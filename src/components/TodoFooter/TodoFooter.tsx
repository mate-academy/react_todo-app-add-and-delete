import React from 'react';
import { TODO_STATUS, TodoStatus } from '../../types/TodoStatus';
import clsx from 'clsx';

type Props = {
  todosActiveCount: number;
  todosStatusFilter: TodoStatus;
  onSelectStatusFilter: (todoStatus: TodoStatus) => void;
  disableClearCompletedBtn: boolean;
  onClearCompleted: () => void;
};

export const TodoFooter: React.FC<Props> = ({
  todosActiveCount,
  disableClearCompletedBtn,
  todosStatusFilter,
  onSelectStatusFilter,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosActiveCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={clsx('filter__link', {
            selected: todosStatusFilter === TODO_STATUS.ALL,
          })}
          data-cy="FilterLinkAll"
          onClick={() => onSelectStatusFilter(TODO_STATUS.ALL)}
        >
          {TODO_STATUS.ALL}
        </a>

        <a
          href="#/active"
          className={clsx('filter__link', {
            selected: todosStatusFilter === TODO_STATUS.ACTIVE,
          })}
          data-cy="FilterLinkActive"
          onClick={() => onSelectStatusFilter(TODO_STATUS.ACTIVE)}
        >
          {TODO_STATUS.ACTIVE}
        </a>

        <a
          href="#/completed"
          className={clsx('filter__link', {
            selected: todosStatusFilter === TODO_STATUS.COMPLETED,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => onSelectStatusFilter(TODO_STATUS.COMPLETED)}
        >
          {TODO_STATUS.COMPLETED}
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onClearCompleted}
        disabled={disableClearCompletedBtn}
      >
        Clear completed
      </button>
    </footer>
  );
};
