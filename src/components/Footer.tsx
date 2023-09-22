import React from 'react';
import classNames from 'classnames';
import { Status } from '../types/Status';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[] | null,
  count: number | undefined,
  status: Status,
  setStatus: (status: Status) => void,
  removeCompleted: () => void,
};

export const Footer: React.FC<Props> = ({
  todos,
  count,
  status,
  setStatus,
  removeCompleted,
}) => {
  const completedTodo = todos?.some(todo => todo.completed);

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${count} items left`}
      </span>
      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: status === Status.All,
          })}
          onClick={() => setStatus(Status.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: status === Status.Active,
          })}
          onClick={() => setStatus(Status.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: status === Status.Completed,
          })}
          onClick={() => setStatus(Status.Completed)}
        >
          Completed
        </a>
      </nav>
      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={removeCompleted}
        disabled={!completedTodo}
      >
        Clear completed
      </button>
    </footer>
  );
};
