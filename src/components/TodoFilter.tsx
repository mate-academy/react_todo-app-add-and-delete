import React from 'react';
import { Status } from '../types/Status';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  setStatus: (status: Status) => void;
  status: Status;
  todos: Todo[];
  onDelete: (id: number) => Promise<void>;
};

export const TodoFilter: React.FC<Props> = ({
  setStatus,
  status,
  todos,
  onDelete,
}) => {
  const completedTodos = todos.filter(todo => todo.completed);
  const activeTodos = todos.filter(todo => !todo.completed);

  const handleSeveralDeletes = () => {
    const deleteTodos: Promise<void>[] = [];

    completedTodos.forEach(todo => {
      deleteTodos.push(onDelete(todo.id));
    });

    Promise.allSettled(deleteTodos);
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos.length} {activeTodos.length === 1 ? 'item' : 'items'} left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: status === Status.all,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setStatus(Status.all)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: status === Status.active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setStatus(Status.active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: status === Status.completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setStatus(Status.completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!completedTodos.length}
        onClick={handleSeveralDeletes}
      >
        Clear completed
      </button>
    </footer>
  );
};
