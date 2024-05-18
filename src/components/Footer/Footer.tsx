import React, { useMemo } from 'react';
import { Todo } from '../../types/Todo';
import { Filter } from '../../types/Filter';
import classNames from 'classnames';

interface Props {
  todos: Todo[];
  filter: Filter;
  addFilter: React.Dispatch<React.SetStateAction<Filter>>;
  clearCompleted: () => void;
}

export const Footer: React.FC<Props> = ({
  todos, 
  filter, 
  addFilter, 
  clearCompleted,
}) => {
  const counter = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const hasCompletedTodos = todos.some(todo => todo.completed);

  const handleFilter = (newFilter: Filter) => (e: React.FormEvent) => {
    e.preventDefault();
    addFilter(newFilter);
  };

  if (!todos.length) {
    return null;
  }

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {counter} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', { selected: filter === 'all' })}
          data-cy="FilterLinkAll"
          onClick={handleFilter('all')}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filter === 'active',
          })}
          data-cy="FilterLinkActive"
          onClick={handleFilter('active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filter === 'completed',
          })}
          data-cy="FilterLinkCompleted"
          onClick={handleFilter('completed')}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompletedTodos}
        onClick={clearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};