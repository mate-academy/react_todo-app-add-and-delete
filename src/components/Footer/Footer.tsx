import React, { useContext } from 'react';
import { TodoContext } from '../../TodoContext';
import { Filter } from '../../types/Filter';
import classNames from 'classnames';

export const Footer: React.FC = () => {
  const { todos, filter, deleteTodo, setFilter } = useContext(TodoContext);

  const completeTodos = todos.filter(todo => todo.completed);
  const activeTodos = todos.filter(todo => !todo.completed);

  const handleFilterAll = () => {
    setFilter(Filter.All);
  };

  const handleFilterActive = () => {
    setFilter(Filter.Active);
  };

  const handleFilterCompleted = () => {
    setFilter(Filter.Completed);
  };

  const handleClearCompleted = () => {
    for (const todo of completeTodos) {
      deleteTodo(todo.id);
    }
  };

  if (!todos.length) {
    return <></>;
  }

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos.length} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filter === Filter.All,
          })}
          data-cy="FilterLinkAll"
          onClick={handleFilterAll}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filter === Filter.Active,
          })}
          onClick={handleFilterActive}
          data-cy="FilterLinkActive"
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filter === Filter.Completed,
          })}
          onClick={handleFilterCompleted}
          data-cy="FilterLinkCompleted"
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completeTodos.length === 0}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
