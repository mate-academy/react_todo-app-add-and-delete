import React from 'react';
import { Todo } from '../../types/Todo';
import type { FilterType } from '../../types/FilterType';

/* eslint-disable react/jsx-filename-extension */

interface Props {
  todos: Todo[];
  selectedFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  completedList: Todo[];
  onClearCompleted: () => void;
}

export const Footer: React.FC<Props> = ({
  todos,
  selectedFilter,
  onFilterChange,
  completedList,
  onClearCompleted,
}) => {
  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  const handleFilterClick =
    (filter: FilterType) => (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      onFilterChange(filter);
    };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={`filter__link ${selectedFilter === 'all' ? 'selected' : ''}`}
          data-cy="FilterLinkAll"
          onClick={handleFilterClick('all')}
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link ${selectedFilter === 'active' ? 'selected' : ''}`}
          data-cy="FilterLinkActive"
          onClick={handleFilterClick('active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link ${selectedFilter === 'completed' ? 'selected' : ''}`}
          data-cy="FilterLinkCompleted"
          onClick={handleFilterClick('completed')}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onClearCompleted}
        disabled={completedList.length === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};

export default Footer;
