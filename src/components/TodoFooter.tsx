import React from 'react';
import { Todo } from '../types/Todo';
import { Filter } from '../utils/Filter';

/* eslint-disable @typescript-eslint/indent */
type Props = {
  todos: Todo[];
  filter: Filter;
  setFilter: React.Dispatch<React.SetStateAction<Filter>>;
  handleClearCompleted: () => void;
};
/* eslint-enable @typescript-eslint/indent */

export const TodoFooter: React.FC<Props> = ({
  todos,
  filter,
  setFilter,
  handleClearCompleted,
}) => {
  const completedCount = todos?.filter(todo => todo.completed).length ?? 0;
  const activeCount = todos ? todos.length - completedCount : 0;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeCount} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={`filter__link ${filter === 'all' ? 'selected' : ''}`}
          data-cy="FilterLinkAll"
          onClick={e => {
            e.preventDefault();
            setFilter(Filter.All);
          }}
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link ${filter === 'active' ? 'selected' : ''}`}
          data-cy="FilterLinkActive"
          onClick={e => {
            e.preventDefault();
            setFilter(Filter.Active);
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link ${filter === 'completed' ? 'selected' : ''}`}
          data-cy="FilterLinkCompleted"
          onClick={e => {
            e.preventDefault();
            setFilter(Filter.Completed);
          }}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className={`todoapp__clear-completed ${todos.some(todo => todo.completed) ? '' : 'hidden'}`}
        data-cy="ClearCompletedButton"
        onClick={handleClearCompleted}
        disabled={!todos.some(todo => todo.completed)}
      >
        Clear completed
      </button>
    </footer>
  );
};
