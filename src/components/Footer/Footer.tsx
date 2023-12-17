import React, { useContext } from 'react';
import cn from 'classnames';
import { Status } from '../../types/Status';
import { AppContext } from '../TodoContext/TodoContext';

type Props = {
  uncompletedTodosCount: number;
  status: Status;
  setStatus: (arg: Status) => void;
  isSomeTodosCompleted: boolean;
};

export const Footer: React.FC<Props> = ({
  uncompletedTodosCount,
  status,
  setStatus,
  isSomeTodosCompleted,
}) => {
  const { clearCompleted } = useContext(AppContext);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${uncompletedTodosCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: status === Status.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setStatus(Status.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: status === Status.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setStatus(Status.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: status === Status.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setStatus(Status.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className={cn('todoapp__clear-completed', {
          disabled: !isSomeTodosCompleted,
        })}
        data-cy="ClearCompletedButton"
        disabled={!isSomeTodosCompleted}
        onClick={clearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
