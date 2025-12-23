import React from 'react';
import { Todo, FilterType } from '../types/Todo';

interface FooterProps {
  activeTodos: Todo[];
  completedTodos: number[];
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  handleClearAll: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  activeTodos,
  completedTodos,
  filter,
  setFilter,
  handleClearAll,
}) => {
  return (
    <>
      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count" data-cy="TodosCounter">
          {activeTodos.length} items left
        </span>

        <nav className="filter" data-cy="Filter">
          <a
            href="#/"
            className={`filter__link ${filter === FilterType.All && 'selected'}`}
            data-cy="FilterLinkAll"
            onClick={e => {
              e.preventDefault();
              setFilter(FilterType.All);
            }}
          >
            All
          </a>

          <a
            href="#/active"
            className={`filter__link ${filter === FilterType.Active && 'selected'}`}
            data-cy="FilterLinkActive"
            onClick={e => {
              e.preventDefault();
              setFilter(FilterType.Active);
            }}
          >
            Active
          </a>

          <a
            href="#/completed"
            className={`filter__link ${filter === FilterType.Completed && 'selected'}`}
            data-cy="FilterLinkCompleted"
            onClick={e => {
              e.preventDefault();
              setFilter(FilterType.Completed);
            }}
          >
            Completed
          </a>
        </nav>

        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          disabled={completedTodos.length === 0}
          onClick={() => {
            handleClearAll();
          }}
        >
          Clear completed
        </button>
      </footer>
    </>
  );
};
