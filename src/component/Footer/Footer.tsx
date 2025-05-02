import React from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  status: string;
  handleClick: (event: React.MouseEvent) => void;
  deleteTodos: (todos: number[]) => Promise<unknown[]>;
};

export const Footer: React.FC<Props> = ({
  todos,
  status,
  handleClick,
  deleteTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todos?.filter(td => td.completed !== true).length} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={`filter__link ${status === 'all' ? 'selected' : ''}`}
          data-cy="FilterLinkAll"
          onClick={event => {
            handleClick(event);
          }}
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link ${status === 'active' ? 'selected' : ''}`}
          data-cy="FilterLinkActive"
          onClick={event => {
            handleClick(event);
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link ${status === 'completed' ? 'selected' : ''}`}
          data-cy="FilterLinkCompleted"
          onClick={event => {
            handleClick(event);
          }}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      {todos?.filter(todo => todo.completed === true).length !== 0 && (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={() =>
            deleteTodos(
              todos?.filter(todo => todo.completed === true).map(td => td.id),
            )
          }
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
