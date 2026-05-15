import React from 'react';
import { Todo } from '../types/Todo';
import { Filter } from '../types/Filter';
import classNames from 'classnames';
import { FILTER } from '../api/filter';

type Props = {
  todos: Todo[];
  filter: Filter;
  setFilter: (filter: Filter) => void;
  onDelete: (todoId: number) => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  filter,
  setFilter,
  onDelete,
}) => {
  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);
  const isCompletedTodos = todos.some(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos.length} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filter === FILTER.all,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilter(FILTER.all)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filter === FILTER.active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilter(FILTER.active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filter === FILTER.completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter(FILTER.completed)}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!isCompletedTodos}
        onClick={() => {
          completedTodos.map(todo => onDelete(todo.id));
        }}
      >
        Clear completed
      </button>
    </footer>
  );
};
