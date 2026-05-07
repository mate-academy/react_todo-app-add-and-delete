import React from 'react';
import { QueryTodos } from '../../App';
import { Todo } from '../../types/Todo';

type Props = {
  activeTodosCount: number;
  completedTodos: Todo[];
  clearCompletedTodos: () => void;
  query: QueryTodos;
  setQuery: (query: QueryTodos) => void;
};

export const Footer: React.FC<Props> = ({
  activeTodosCount,
  completedTodos,
  clearCompletedTodos,
  query,
  setQuery,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      {/* Hide the footer if there are no todos */}
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodosCount} items left`}
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={
            query === QueryTodos.All ? `filter__link selected` : 'filter__link'
          }
          data-cy="FilterLinkAll"
          onClick={() => setQuery(QueryTodos.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={
            query === QueryTodos.Active
              ? `filter__link selected`
              : 'filter__link'
          }
          data-cy="FilterLinkActive"
          onClick={() => setQuery(QueryTodos.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={
            query === QueryTodos.Completed
              ? `filter__link selected`
              : 'filter__link'
          }
          data-cy="FilterLinkCompleted"
          onClick={() => setQuery(QueryTodos.Completed)}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodos.length === 0}
        onClick={() => clearCompletedTodos()}
      >
        Clear completed
      </button>
    </footer>
  );
};
