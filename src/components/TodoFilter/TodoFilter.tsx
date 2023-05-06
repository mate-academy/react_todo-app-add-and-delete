import React from 'react';
import classnames from 'classnames';
import { TodoStatus } from '../../types/TodoStatus';

interface Props {
  onStatusChanged: (newStatus: TodoStatus) => void
  status: TodoStatus
  itemsLeft: number
  itemsCompleted: number
  clearCompletedTodos: () => void
}

export const TodoFilter: React.FC<Props> = ({
  onStatusChanged,
  status,
  itemsLeft,
  itemsCompleted,
  clearCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${itemsLeft} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={
            classnames(
              'filter__link',
              { selected: status === TodoStatus.All },
            )
          }
          onClick={() => onStatusChanged(TodoStatus.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={
            classnames(
              'filter__link',
              { selected: status === TodoStatus.Active },
            )
          }
          onClick={() => onStatusChanged(TodoStatus.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={
            classnames(
              'filter__link',
              { selected: status === TodoStatus.Completed },
            )
          }
          onClick={() => onStatusChanged(TodoStatus.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        style={{ visibility: itemsCompleted ? 'visible' : 'hidden' }}
        onClick={clearCompletedTodos}
      >
        Clear completed
      </button>

    </footer>
  );
};
