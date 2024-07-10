import React from 'react';
import classNames from 'classnames';
import { Filter } from '../../types/Filter';
import { Todo } from '../../types/Todo';

interface FooterProps {
  todos: Todo[];
  filterBy: string;
  setFilterBy: (filterBy: Filter) => void;
  handleClearCompleted: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  todos,
  filterBy,
  setFilterBy,
  handleClearCompleted,
}) => {
  const todosCounter = todos.filter(todo => !todo.completed).length;

  const hasAnyCompletedTodos = todos.some(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosCounter} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filterBy === Filter.all,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilterBy(Filter.all)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filterBy === Filter.active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilterBy(Filter.active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filterBy === Filter.completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilterBy(Filter.completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasAnyCompletedTodos}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
