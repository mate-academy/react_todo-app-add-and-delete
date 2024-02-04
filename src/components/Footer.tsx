import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[]
  setSortField: (state:string) => void;
  sortField: string;
  clearCompletedTodos: () => void,
};
export const Footer: React.FC <Props> = ({
  todos,
  setSortField,
  sortField,
  clearCompletedTodos,
}) => {
  const unCompletedTodos = todos.filter(todo => todo.completed === false);
  const completedTodos = todos.filter(todo => todo.completed === true);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${unCompletedTodos.length} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          onClick={() => {
            setSortField('All');
          }}
          href="#/"
          className={`filter__link ${classNames({ selected: sortField === 'All' })}`}
          data-cy="FilterLinkAll"
        >
          All
        </a>

        <a
          onClick={() => {
            setSortField('Active');
          }}
          href="#/active"
          className={`filter__link ${classNames({ selected: sortField === 'Active' })}`}
          data-cy="FilterLinkActive"
        >
          Active
        </a>

        <a
          onClick={() => {
            setSortField('Completed');
          }}
          href="#/completed"
          className={`filter__link ${classNames({ selected: sortField === 'Completed' })}`}
          data-cy="FilterLinkCompleted"
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      <button
        onClick={clearCompletedTodos}
        disabled={completedTodos.length === 0}
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
      >
        Clear completed
      </button>
    </footer>
  );
};
