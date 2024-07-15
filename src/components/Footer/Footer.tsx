import React from 'react';
import { Todo } from '../../types/Todo';
import { FilterType } from '../../types/FilterType';

type FooterProps = {
  todos: Todo[];
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
};

export const Footer: React.FC<FooterProps> = ({
  todos,
  filter,
  onFilterChange,
}) => {
  if (todos.length === 0) {
    return null;
  }

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodosCount = todos.filter(todo => todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={`filter__link ${filter === FilterType.All ? 'selected' : ''}`}
          data-cy="FilterLinkAll"
          onClick={() => onFilterChange(FilterType.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link ${filter === FilterType.Active ? 'selected' : ''}`}
          data-cy="FilterLinkActive"
          onClick={() => onFilterChange(FilterType.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link ${filter === FilterType.Completed ? 'selected' : ''}`}
          data-cy="FilterLinkCompleted"
          onClick={() => onFilterChange(FilterType.Completed)}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodosCount === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
