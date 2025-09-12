import React from 'react';

import { Todo } from '../types/Todo';
import { SortType } from '../App';

type Props = {
  todos: Todo[];
  filter: SortType;
  setFilter: (filter: SortType) => void;
  clearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  filter,
  setFilter,
  clearCompleted,
}) => {
  const activeCount = todos.filter(
    todo => !todo.completed && todo.id !== 0,
  ).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeCount} {activeCount === 1 ? 'item' : 'items'} left
      </span>

      <nav className="filters" data-cy="Filter">
        <a
          href="#/"
          className={`filter__link ${filter === 'All' ? 'selected' : ''}`}
          data-cy="FilterLinkAll"
          onClick={() => setFilter(SortType.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link ${filter === 'Active' ? 'selected' : ''}`}
          data-cy="FilterLinkActive"
          onClick={() => setFilter(SortType.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link ${filter === 'Completed' ? 'selected' : ''}`}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter(SortType.Completed)}
        >
          Completed
        </a>
      </nav>
      <button
        type="button"
        className="clear-completed"
        data-cy="ClearCompletedButton"
        onClick={clearCompleted}
        disabled={!todos.some(todo => todo.completed)}
      >
        Clear completed
      </button>
    </footer>
  );
};

export default Footer;
