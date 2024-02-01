/* eslint-disable import/no-cycle */
import React, { useContext } from 'react';
import classNames from 'classnames';
import { TodosContext } from '../TodoContext/TodoContext';
import { Status } from '../types/Status';

export const Footer: React.FC = () => {
  const {
    todos,
    deleteCompletedTodos,
    setQuery,
    query,
  } = useContext(TodosContext);

  const unCompletedTodos = todos.filter(({ completed }) => !completed);

  const completedTodos = todos.filter(({ completed }) => completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${unCompletedTodos.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          data-cy="FilterLinkAll"
          className={classNames('filter__link', {
            selected: query === Status.All,
          })}
          onClick={() => {
            setQuery(Status.All);
          }}
        >
          {Status.All}
        </a>

        <a
          href="#/active"
          data-cy="FilterLinkActive"
          className={classNames('filter__link', {
            selected: query === Status.Active,
          })}
          onClick={() => {
            setQuery(Status.Active);
          }}
        >
          {Status.Active}
        </a>

        <a
          href="#/completed"
          data-cy="FilterLinkCompleted"
          className={classNames('filter__link', {
            selected: query === Status.Completed,
          })}
          onClick={() => {
            setQuery(Status.Completed);
          }}
        >
          {Status.Completed}
        </a>
      </nav>

      {!!completedTodos.length && (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={deleteCompletedTodos}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
