import React from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';
import { FilterQuery } from '../types/FilterQuery';

type Props = {
  todos: Todo[];
  activeBtn: string;
  handleChangeFilter: (value: string) => void;
  clearCompletedTodos: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  activeBtn,
  handleChangeFilter,
  clearCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todos.filter(todo => !todo.completed).length} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: activeBtn === FilterQuery.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => handleChangeFilter(FilterQuery.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: activeBtn === FilterQuery.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => handleChangeFilter(FilterQuery.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: activeBtn === FilterQuery.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => handleChangeFilter(FilterQuery.Completed)}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!todos.some(todo => todo.completed)}
        onClick={() => clearCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
