import React from 'react';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';

type Props = {
  countItem: number;
  removeCompletedTodo: () => void,
};

export const Footer: React.FC<Props> = ({ countItem, removeCompletedTodo }) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {countItem}
        {' '}
        items left
      </span>

      <nav className="filter" data-cy="Filter">
        <NavLink
          data-cy="FilterLinkAll"
          to="/"
          className={({ isActive }) => `filter__link ${isActive ? 'selected' : ''}`}
        >
          All
        </NavLink>

        <NavLink
          data-cy="FilterLinkActive"
          to="active"
          className={({ isActive }) => `filter__link ${isActive ? 'selected' : ''}`}
        >
          Active
        </NavLink>
        <NavLink
          data-cy="FilterLinkCompleted"
          to="completed"
          className={({ isActive }) => `filter__link ${isActive ? 'selected' : ''}`}
        >
          Completed
        </NavLink>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        onClick={removeCompletedTodo}
        className={
          classNames(
            'todoapp__clear-completed',
            { 'completed-clear--hidden': countItem === 0 },
          )
        }
      >
        Clear completed
      </button>
    </footer>
  );
};
