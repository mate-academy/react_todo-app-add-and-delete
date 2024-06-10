import React from 'react';
import { Status } from '../../types/Status';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[];
  filterBy: Status;
  setFilterBy: (filterBy: Status) => void;
  deleteAllCompleted: () => void;
}

export const Footer: React.FC<Props> = ({
  todos,
  filterBy,
  setFilterBy,
  deleteAllCompleted,
}) => {
  const isActiveTodos = todos.filter(todo => !todo.completed).length;
  const completedTodos = todos.filter(todo => todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${isActiveTodos} ${isActiveTodos === 1 ? 'item' : 'items'} left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={`filter__link ${filterBy === Status.All ? 'selected' : ''}`}
          data-cy="FilterLinkAll"
          onClick={() => setFilterBy(Status.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link ${filterBy === Status.Active ? 'selected' : ''}`}
          data-cy="FilterLinkActive"
          onClick={() => setFilterBy(Status.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link ${filterBy === Status.Completed ? 'selected' : ''}`}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilterBy(Status.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!completedTodos}
        onClick={deleteAllCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
