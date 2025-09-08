import React from 'react';

import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  filter: string;
  setFilter: (filter: string) => void;
};

export const Footer: React.FC<Props> = ({ todos, filter, setFilter }) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="TodosCounter">
      {todos.filter(e => !e.completed).length} items left
    </span>

    <nav className="filters" data-cy="Filter">
      <a
        href="#/"
        className={`filter__link ${filter === 'All' ? 'selected' : ''}`}
        data-cy="FilterLinkAll"
        onClick={() => setFilter('All')}
      >
        All
      </a>

      <a
        href="#/active"
        className={`filter__link ${filter === 'Active' ? 'selected' : ''}`}
        data-cy="FilterLinkActive"
        onClick={() => setFilter('Active')}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={`filter__link ${filter === 'Completed' ? 'selected' : ''}`}
        data-cy="FilterLinkCompleted"
        onClick={() => setFilter('Completed')}
      >
        Completed
      </a>
    </nav>
    <button
      type="button"
      className="clear-completed"
      data-cy="ClearCompletedButton"
      disabled={todos.filter(todo => todo.completed).length === 0}
    >
      Clear completed
    </button>
  </footer>
);

export default Footer;
