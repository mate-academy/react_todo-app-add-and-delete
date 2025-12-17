import classNames from 'classnames';
import './Footer.scss';
import { StatusTypes } from '../../enums/StatusTypes';
import React from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  todosCount: number;
  statusFilter: StatusTypes;
  onStatusFilter: (statusFilter: StatusTypes) => void;
  onClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  todosCount,
  statusFilter,
  onStatusFilter,
  onClearCompleted,
}) => {
  const isNoComplitedTodos = !todos.some(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: statusFilter === StatusTypes.ALL,
          })}
          data-cy="FilterLinkAll"
          onClick={() => onStatusFilter(StatusTypes.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: statusFilter === StatusTypes.ACTIVE,
          })}
          data-cy="FilterLinkActive"
          onClick={() => onStatusFilter(StatusTypes.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: statusFilter === StatusTypes.COMPLETED,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => onStatusFilter(StatusTypes.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      <button
        disabled={isNoComplitedTodos}
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
