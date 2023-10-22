import React from 'react';
import cn from 'classnames';
import { Status } from '../../types/Status';

interface Props {
  activeTodosLength: number;
  completedTodosLength: number;
  filterStatus: string;
  changeTodosStatus: (status: string) => void;
  removeAllTodos: () => void;
}

export const TodoFooter: React.FC<Props> = ({
  activeTodosLength,
  completedTodosLength,
  filterStatus,
  changeTodosStatus = () => {},
  removeAllTodos = () => {},
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodosLength} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: filterStatus === Status.all,
          })}
          data-cy="FilterLinkAll"
          onClick={() => changeTodosStatus(Status.all)}
        >
          {Status.all}
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filterStatus === Status.active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => changeTodosStatus(Status.active)}
        >
          {Status.active}
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filterStatus === Status.completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => changeTodosStatus(Status.completed)}
        >
          {Status.completed}
        </a>
      </nav>

      {completedTodosLength > 0 && (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={removeAllTodos}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
