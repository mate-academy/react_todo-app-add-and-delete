import React, { useContext } from 'react';

import classNames from 'classnames';
import { TodoContext } from '../services/TodoContext';
import { Filter } from '../types/Filter';

export const Footer: React.FC = () => {
  const { todos, filter, deleteTodo, setFilter } = useContext(TodoContext);

  const completedTodos = todos.filter(todo => todo.completed);
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
    for (const todo of completedTodos) {
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
          href="#"
          className={classNames('filter__link', {
            selected: filter === Filter.All,
          })}
          data-cy="FilterLinkAll"
          onClick={handleFilterAll}
        >
          All
        </a>

        <a
          href="#active"
          className={classNames('filter__link', {
            selected: filter === Filter.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={handleFilterActive}
        >
          Active
        </a>

        <a
          href="#completed"
          className={classNames('filter__link', {
            selected: filter === Filter.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={handleFilterCompleted}
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
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
