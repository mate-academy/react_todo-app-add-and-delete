import React from 'react';
import cn from 'classnames';
import { Filter } from '../../types/Filter';
import { Todo } from '../../types/Todo';

interface Props {
  activeTodosCount: number;
  areThereCompletedTodos: boolean;
  filter: Filter;
  setFilter: (value: Filter) => void;
  todosFromServer: Todo[];
  handleClearCompleted: (todos: Todo[]) => void;
}

export const Footer: React.FC<Props> = ({
  activeTodosCount,
  areThereCompletedTodos,
  filter,
  setFilter,
  todosFromServer,
  handleClearCompleted,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="TodosCounter">
      {activeTodosCount} items left
    </span>

    {/* Active link should have the 'selected' class */}
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={cn('filter__link', { selected: filter === Filter.all })}
        data-cy="FilterLinkAll"
        onClick={() => setFilter(Filter.all)}
      >
        All
      </a>

      <a
        href="#/active"
        className={cn('filter__link', { selected: filter === Filter.active })}
        data-cy="FilterLinkActive"
        onClick={() => setFilter(Filter.active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={cn('filter__link', {
          selected: filter === Filter.completed,
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => setFilter(Filter.completed)}
      >
        Completed
      </a>
    </nav>

    {/* this button should be disabled if there are no completed todos */}
    <button
      type="button"
      className="todoapp__clear-completed"
      data-cy="ClearCompletedButton"
      disabled={!areThereCompletedTodos}
      onClick={() => handleClearCompleted(todosFromServer)}
    >
      Clear completed
    </button>
  </footer>
);
