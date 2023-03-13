import React, { useState } from 'react';
import classNames from 'classnames';
import { Status } from '../../types/Status';

type Props = {
  filterTodos: (type: Status) => void;
  countOfActiveTodos: number;
  completedTodoLength: number;
  removeAllCompletedTodos: () => void;
};

export const Footer: React.FC<Props> = React.memo(({
  filterTodos,
  countOfActiveTodos,
  completedTodoLength,
  removeAllCompletedTodos,
}) => {
  const [isFilterSelected, setIsFilterSelected] = useState(Status.ALL);

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
              { 'selected': isFilterSelected === Status.ALL },
            )}
            onClick={() => {
              filterTodos(Status.ALL);
              setIsFilterSelected(Status.ALL);
            }}
          >
            All
          </a>

          <a
            href="#/active"
            className={classNames(
              'filter__link',
              // eslint-disable-next-line
              { 'selected': isFilterSelected === Status.ACTIVE },
            )}
            onClick={() => {
              filterTodos(Status.ACTIVE);
              setIsFilterSelected(Status.ACTIVE);
            }}
          >
            Active
          </a>

          <a
            href="#/completed"
            className={classNames(
              'filter__link',
              // eslint-disable-next-line
              { 'selected': isFilterSelected === Status.COMPLETED },
            )}
            onClick={() => {
              filterTodos(Status.COMPLETED);
              setIsFilterSelected(Status.COMPLETED);
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
