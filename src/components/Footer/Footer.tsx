import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { Status } from '../../types/Status';

type Props = {
  activeTodos: Todo[];
  completedTodos: Todo[];
  selectedStatus: Status;
  onSelectedStatus: (status: Status) => void;
  clearCompleted: () => void;
};

export const Footer: React.FC<Props> = React.memo(({
  activeTodos,
  completedTodos,
  selectedStatus,
  onSelectedStatus,
  clearCompleted,
}) => {
  const handleSelectedStatus = (status: Status) => {
    onSelectedStatus(status);
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeTodos.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link',
            { selected: selectedStatus === Status.All },
          )}
          onClick={() => handleSelectedStatus(Status.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: selectedStatus === Status.Active },
          )}
          onClick={() => handleSelectedStatus(Status.Active)}
        >
          Active
        </a>

        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: selectedStatus === Status.Completed },
          )}
          onClick={() => handleSelectedStatus(Status.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className={classNames('todoapp__clear-completed', {
          'has-text-white': completedTodos.length === 0,
        })}
        disabled={completedTodos.length === 0}
        onClick={clearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
});
