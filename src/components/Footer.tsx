import React from 'react';
import { Todo } from '../types/Todo';
import { Status } from '../types/Status';
import cn from 'classnames';

type Props = {
  todos: Todo[];
  status: Status;
  setStatus: (status: Status) => void;
  deleteCompletedTodo: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  status,
  setStatus,
  deleteCompletedTodo: deleteCompletedTodo,
}) => {
  const todosLeft = todos.filter(todo => !todo.completed).length;
  const hasCompleted = todos.some(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todosLeft} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: status === Status.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setStatus(Status.All)}
        >
          {Status.All}
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: status === Status.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setStatus(Status.Active)}
        >
          {Status.Active}
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: status === Status.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setStatus(Status.Completed)}
        >
          {Status.Completed}
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompleted}
        onClick={deleteCompletedTodo}
      >
        Clear completed
      </button>
    </footer>
  );
};
