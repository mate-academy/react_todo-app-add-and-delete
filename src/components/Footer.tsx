import React from 'react';
import { FilterStatus } from '../types/FilterStatus';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  todos: Todo[];
  filter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
  onClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  filter,
  onFilterChange,
  onClearCompleted,
}) => {
  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const hasCopletedTodo = todos.some(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodosCount} items left`}
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filter === FilterStatus.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => onFilterChange(FilterStatus.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filter === FilterStatus.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => onFilterChange(FilterStatus.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filter === FilterStatus.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => onFilterChange(FilterStatus.Completed)}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCopletedTodo}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
