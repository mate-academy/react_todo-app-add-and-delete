import React from 'react';
import { FilterType } from '../utils/filter';
import { Todo } from '../types/Todo';

type Props = {
  shownTodos: Todo[];
  filterType: FilterType;
  setFilterType: (filterType: FilterType) => void;
  counter: number;
  bulkDelete: (todos: Todo[]) => void;
};

export const Footer: React.FC<Props> = ({
  shownTodos,
  filterType,
  setFilterType,
  counter,
  bulkDelete,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {counter + ' items left'}
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={`filter__link ${filterType === FilterType.ALL && 'selected'}`}
          data-cy="FilterLinkAll"
          onClick={event => {
            event.preventDefault();
            setFilterType(FilterType.ALL);
          }}
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link ${filterType === FilterType.ACTIVE && 'selected'}`}
          data-cy="FilterLinkActive"
          onClick={event => {
            event.preventDefault();
            setFilterType(FilterType.ACTIVE);
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link ${filterType === FilterType.COMPLETED && 'selected'}`}
          data-cy="FilterLinkCompleted"
          onClick={event => {
            event.preventDefault();
            setFilterType(FilterType.COMPLETED);
          }}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!shownTodos.some(todo => todo.completed)}
        onClick={() => {
          bulkDelete(shownTodos.filter(todo => todo.completed));
        }}
      >
        Clear completed
      </button>
    </footer>
  );
};
