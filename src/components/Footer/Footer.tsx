import React from 'react';
import { Todo } from '../../types/Todo';
import { FilterMethods } from '../../types/FilterMethods';

interface Props {
  todos: Todo[];
  filteringMethod: FilterMethods;
  setFilteringMethod: (f_method: FilterMethods) => void;
  deleteCompleted: () => void;
}

export const Footer: React.FC<Props> = ({
  todos,
  filteringMethod,
  setFilteringMethod,
  deleteCompleted,
}) => {
  const hasCompleted = todos.some(todo => todo.completed);
  /* Hide the footer if there are no todos */

  return (
    todos.length > 0 && (
      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count" data-cy="TodosCounter">
          {todos.filter(todo => !todo.completed).length} items left
        </span>

        {/* Active link should have the 'selected' class */}
        <nav className="filter" data-cy="Filter">
          <a
            href="#/"
            className={`filter__link ${filteringMethod === 'All' ? 'selected' : ''}`}
            data-cy="FilterLinkAll"
            onClick={() => setFilteringMethod('All')}
          >
            All
          </a>

          <a
            href="#/active"
            className={`filter__link ${filteringMethod === 'Active' ? 'selected' : ''}`}
            data-cy="FilterLinkActive"
            onClick={() => setFilteringMethod('Active')}
          >
            Active
          </a>

          <a
            href="#/completed"
            className={`filter__link ${filteringMethod === 'Completed' ? 'selected' : ''}`}
            data-cy="FilterLinkCompleted"
            onClick={() => setFilteringMethod('Completed')}
          >
            Completed
          </a>
        </nav>

        {/* this button should be disabled if there are no completed todos */}
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          disabled={!hasCompleted}
          onClick={() => deleteCompleted()}
        >
          Clear completed
        </button>
      </footer>
    )
  );
};
