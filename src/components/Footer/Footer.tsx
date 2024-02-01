import React from 'react';
import cn from 'classnames';
import { Status } from '../../types/Status';
import { Todo } from '../../types/Todo';
import { deleteTodos } from '../../api/todos';

interface Props {
  activeTodosCount: number;
  filter: Status;
  onFilter: (status: Status) => void;
  todos: Todo[];
  onDeleteTodo: (id: number) => void;
  onError: (error: string) => void;
  onAddDeletingPostId: (id: number | null) => void;
}

export const Footer: React.FC<Props> = ({
  activeTodosCount,
  filter,
  onFilter,
  todos,
  onDeleteTodo,
  onError,
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
        {`${activeTodosCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link',
            { selected: filter === Status.All })}
          data-cy="FilterLinkAll"
          onClick={() => onFilter(Status.All)}
        >
          {Status.All}
        </a>

        <a
          href="#/active"
          className={cn('filter__link',
            { selected: filter === Status.Active })}
          data-cy="FilterLinkActive"
          onClick={() => onFilter(Status.Active)}
        >
          {Status.Active}
        </a>

        <a
          href="#/completed"
          className={cn('filter__link',
            { selected: filter === Status.Completed })}
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
        onClick={handleDeleteTodos}
        disabled={!todosIds.length}
      >
        Clear completed
      </button>
    </footer>
  );
};
