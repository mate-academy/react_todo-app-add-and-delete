import React from 'react';
import classNames from 'classnames';
import { TodoFilter } from '../enums/TodoFilters.enum';
import { Todo } from '../types/Todo';

type Props = {
  notCompletedTodosCount: Todo[];
  filter: TodoFilter;
  hasCompletedTodos: boolean;
  setFilter: (filter: TodoFilter) => void;
  onClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  notCompletedTodosCount,
  filter,
  hasCompletedTodos,
  setFilter,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {notCompletedTodosCount.length} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filter === TodoFilter.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilter(TodoFilter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filter === TodoFilter.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilter(TodoFilter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filter === TodoFilter.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter(TodoFilter.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompletedTodos}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
