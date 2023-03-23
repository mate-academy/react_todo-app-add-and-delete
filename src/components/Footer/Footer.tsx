import React from 'react';
import classNames from 'classnames';
import { Status } from '../../types/Status';

type Props = {
  onFilterChange: (type: Status) => void;
  filter: Status;
  countOfActiveTodos: number;
  completedTodoLength: number;
  removeAllCompletedTodos: () => void;
};

export const Footer: React.FC<Props> = React.memo(({
  onFilterChange,
  filter,
  countOfActiveTodos,
  completedTodoLength,
  removeAllCompletedTodos,
}) => {
  return (
    <>
      <footer className="todoapp__footer">
        <span className="todo-count">
          {`${countOfActiveTodos} items left`}
        </span>

        <nav className="filter">
          <a
            href="#/"
            className={classNames(
              'filter__link',
              // eslint-disable-next-line
              { 'selected': filter === Status.ALL },
            )}
            onClick={() => {
              onFilterChange(Status.ALL);
            }}
          >
            All
          </a>

          <a
            href="#/active"
            className={classNames(
              'filter__link',
              // eslint-disable-next-line
              { 'selected': filter === Status.ACTIVE },
            )}
            onClick={() => {
              onFilterChange(Status.ACTIVE);
            }}
          >
            Active
          </a>

          <a
            href="#/completed"
            className={classNames(
              'filter__link',
              // eslint-disable-next-line
              { 'selected': filter === Status.COMPLETED },
            )}
            onClick={() => {
              onFilterChange(Status.COMPLETED);
            }}
          >
            Completed
          </a>
        </nav>

        <button
          type="button"
          className={classNames('todoapp__clear-completed', {
            'todoapp__clear-completed--novisible': !completedTodoLength,
          })}
          onClick={removeAllCompletedTodos}
          disabled={!completedTodoLength}
        >
          Clear completed
        </button>
      </footer>
    </>
  );
});
