import React from 'react';
import cn from 'classnames';
import { Status } from '../../types/Todo';

type Props = {
  notCompletedTodos: number;
  setStatus: (status: Status) => void;
  status: Status;
  isClearButtonVisible: boolean;
  deleteCompleted:() => void;
};
export const Footer: React.FC<Props> = (
  {
    setStatus,
    status,
    notCompletedTodos,
    deleteCompleted,
    isClearButtonVisible,
  },
) => {
  const handleClick = (value: Status) => {
    setStatus(value);
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${notCompletedTodos} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter">
        <a
          href="#/"
          className={cn(
            'filter__link',
            {
              selected: status === Status.ALL,
            },
          )}
          onClick={() => {
            handleClick(Status.ALL);
          }}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn(
            'filter__link',
            {
              selected: status === Status.ACTIVE,
            },
          )}
          onClick={() => {
            handleClick(Status.ACTIVE);
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn(
            'filter__link',
            {
              selected: status === Status.COMPLETED,
            },
          )}
          onClick={() => {
            handleClick(Status.COMPLETED);
          }}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className={cn('todoapp__clear-completed',
          {
            'is-invisible': !isClearButtonVisible,
          })}
        onClick={deleteCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
