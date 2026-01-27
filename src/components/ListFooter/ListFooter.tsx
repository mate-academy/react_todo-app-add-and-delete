import React from 'react';
import { FilterType } from '../../types/Filter';

interface ListFooterProps {
  todos: { id: number; completed: boolean }[];
  filter: FilterType;
  onDeleteCompleted: () => void;
}
export const ListFooter: React.FC<ListFooterProps> = ({
  todos,
  filter,
  onDeleteCompleted,
}) => {
  return (
    /* Hide the footer if there are no todos */
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todos.filter(todo => todo.id !== 0 && !todo.completed).length} items
        left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={`filter__link${filter === 'all' ? ' selected' : ''}`}
          data-cy="FilterLinkAll"
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link${filter === 'active' ? ' selected' : ''}`}
          data-cy="FilterLinkActive"
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link${filter === 'completed' ? ' selected' : ''}`}
          data-cy="FilterLinkCompleted"
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!todos.some(todo => todo.id !== 0 && todo.completed)}
        onClick={onDeleteCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
