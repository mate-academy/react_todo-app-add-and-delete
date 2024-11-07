import React from 'react';
import { Todo } from '../types/Todo';
import { FilterTypes } from '../types/filterTypes';

interface TodoFooterProps {
  todos: Todo[];
  filter: FilterTypes;
  setFilter: (filter: FilterTypes) => void;
  deleteCompletedTodos: () => void;
}

export const TodoFooter: React.FC<TodoFooterProps> = ({
  todos,
  filter,
  setFilter,
  deleteCompletedTodos,
}) => {
  const incompleteTodosCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.length - incompleteTodosCount;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {incompleteTodosCount} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={`filter__link ${filter === FilterTypes.All ? 'selected' : ''}`}
          data-cy="FilterLinkAll"
          onClick={() => setFilter(FilterTypes.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link ${filter === FilterTypes.Active ? 'selected' : ''}`}
          data-cy="FilterLinkActive"
          onClick={() => setFilter(FilterTypes.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link  ${filter === FilterTypes.Completed ? 'selected' : ''}`}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter(FilterTypes.Completed)}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={deleteCompletedTodos}
        disabled={completedCount === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
