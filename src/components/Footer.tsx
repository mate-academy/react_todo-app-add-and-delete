import { FC } from 'react';
import React from 'react';

import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  completeFilter: null | boolean;
  setCompleteFilter: (newCompleteFilter: null | boolean) => void;
  deleteFinishedTodos: () => void;
};
export const Footer: FC<Props> = ({
  todos,
  completeFilter,
  setCompleteFilter,
  deleteFinishedTodos,
}) => {
  const handleClick = () => {
    deleteFinishedTodos();
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todos.reduce(
          (count, todo) => (!todo.completed ? count + 1 : count),
          0,
        )}{' '}
        items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={
            'filter__link ' + (completeFilter === null ? 'selected' : '')
          }
          data-cy="FilterLinkAll"
          onClick={() => {
            setCompleteFilter(null);
          }}
        >
          All
        </a>

        <a
          href="#/active"
          className={
            'filter__link ' + (completeFilter === true ? 'selected' : '')
          }
          data-cy="FilterLinkActive"
          onClick={() => {
            setCompleteFilter(true);
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={
            'filter__link ' + (completeFilter === false ? 'selected' : '')
          }
          data-cy="FilterLinkCompleted"
          onClick={() => {
            setCompleteFilter(false);
          }}
        >
          Completed
        </a>
      </nav>
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={todos.every(({ completed }) => !completed)}
        onClick={handleClick}
      >
        Clear completed
      </button>
    </footer>
  );
};
