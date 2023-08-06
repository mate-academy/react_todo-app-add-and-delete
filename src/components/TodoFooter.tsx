import React from 'react';
import classNames from 'classnames';

import { Status } from '../types/Status';
import { Todo } from '../types/Todo';

type Props = {
  filterTodos: Todo[]
  status: Status
  setStatus: React.Dispatch<React.SetStateAction<Status>>
  handleClearCompleted: () => void
};

export const TodoFooter: React.FC<Props> = ({
  status,
  setStatus,
  filterTodos,
  handleClearCompleted,
}) => {
  const completedTodos = filterTodos.find(todo => todo.completed);

  const countActiveTodos = filterTodos.filter(todo => !todo.completed).length;

  const handleStatus = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    clickStatus: Status,
  ) => {
    event.preventDefault();
    setStatus(clickStatus);
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${countActiveTodos} items left`}
      </span>

      <nav className="filter">
        <a
          href="/"
          className={classNames('filter__link', {
            selected: status === Status.All,
          })}
          onClick={event => handleStatus(event, Status.All)}
        >
          All
        </a>

        <a
          href="/active"
          className={classNames('filter__link', {
            selected: status === Status.Active,
          })}
          onClick={event => handleStatus(event, Status.Active)}
        >
          Active
        </a>

        <a
          href="/completed"
          className={classNames('filter__link', {
            selected: status === Status.Completed,
          })}
          onClick={event => handleStatus(event, Status.Completed)}
        >
          Completed
        </a>
      </nav>

      {completedTodos && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={handleClearCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
