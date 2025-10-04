import React, { Dispatch, SetStateAction } from 'react';
import { Todo } from '../types/Todo';

type Filter = 'all' | 'active' | 'completed';

type Props = {
  todos: Todo[];
  filter: Filter;
  setFilter: Dispatch<SetStateAction<Filter>>;
  setTodos: Dispatch<SetStateAction<Todo[]>>;
};

export const Footer: React.FC<Props> = ({
  filter,
  setFilter,
  todos,
  setTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todos.filter(todo => !todo.completed).length} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={`filter__link ${filter === 'all' ? 'selected' : ''}`}
          data-cy="FilterLinkAll"
          onClick={() => setFilter('all')}
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link ${filter === 'active' ? 'selected' : ''}`}
          data-cy="FilterLinkActive"
          onClick={() => setFilter('active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link ${filter === 'completed' ? 'selected' : ''}`}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter('completed')}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={() => {
          setTodos(todos.filter(todo => !todo.completed));
        }}
      >
        Clear completed
      </button>
    </footer>
  );
};
