import React, { useContext } from 'react';
import { StateContext } from '../context/ContextReducer';

export const TodoAppFooter: React.FC = () => {
  const { todoApi } = useContext(StateContext);

  const itemLeft = todoApi.filter(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${itemLeft.length} items left`}
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a href="#/" className="filter__link selected" data-cy="FilterLinkAll">
          All
        </a>

        <a href="#/active" className="filter__link" data-cy="FilterLinkActive">
          Active
        </a>

        <a
          href="#/completed"
          className="filter__link"
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
      >
        Clear completed
      </button>
    </footer>
  );
};
