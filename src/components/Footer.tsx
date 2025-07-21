import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  onFilterChange: (filter: 'all' | 'active' | 'completed') => void;
  setCurrentFilter: 'all' | 'active' | 'completed';
  onClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  setCurrentFilter,
  onFilterChange,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todos.filter(todo => !todo.completed).length} items left`}
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={`filter__link ${setCurrentFilter === 'all' ? 'selected' : ''}`}
          data-cy="FilterLinkAll"
          onClick={() => onFilterChange('all')}
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link ${setCurrentFilter === 'active' ? 'selected' : ''}`}
          data-cy="FilterLinkActive"
          onClick={() => onFilterChange('active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link ${setCurrentFilter === 'completed' ? 'selected' : ''}`}
          data-cy="FilterLinkCompleted"
          onClick={() => onFilterChange('completed')}
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
        disabled={todos.filter(todo => todo.completed).length === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
