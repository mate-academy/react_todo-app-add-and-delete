import classNames from 'classnames';
import React from 'react';
import { Status } from '../../types/Status';
import { Todo } from '../../types/Todo';
import { deleteTodos } from '../../api/todos';

type Props = {
  activeTodosAmount: number;
  filterField: Status;
  onFilter: (status: Status) => void;
  onError: (error: string) => void;
  todos: Todo[];
  onDeleteTodo: (id: number) => void;
  onAddDeletingPostId: (id: number | null) => void;
};

export const Footer: React.FC<Props> = ({
  activeTodosAmount,
  filterField,
  onFilter,
  onError,
  todos,
  onDeleteTodo,
  onAddDeletingPostId,
}) => {
  const todosIds = todos
    .filter(({ completed }) => completed)
    .map(({ id }) => id);

  const handleDeleteTodos = () => {
    onError('');

    todosIds.forEach(id => {
      onAddDeletingPostId(id);
      deleteTodos(id)
        .then(() => onDeleteTodo(id))
        .catch(() => {
          onError('Unable to delete a todo');
        })
        .finally(() => onAddDeletingPostId(null));
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodosAmount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: filterField === Status.All },
          )}
          data-cy="FilterLinkAll"
          onClick={() => onFilter(Status.All)}
        >
          {Status.All}
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: filterField === Status.Active },
          )}
          data-cy="FilterLinkActive"
          onClick={() => onFilter(Status.Active)}
        >
          {Status.Active}
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: filterField === Status.Completed },
          )}
          data-cy="FilterLinkCompleted"
          onClick={() => onFilter(Status.Completed)}
        >
          {Status.Completed}
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!todosIds.length}
        onClick={handleDeleteTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
