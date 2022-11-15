import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  onDeleteTodo: (event: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
  isLoading: boolean;
  deletedTodoIds: number[];
  deleteTodoId: number;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDeleteTodo,
  isLoading,
  deletedTodoIds,
  deleteTodoId,
}) => {
  const { title, completed, id } = todo;

  return (
    <li
      data-cy="Todo"
      key={id}
      className={classNames('todo',
        { completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        value={id}
        onClick={onDeleteTodo}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={((id === deleteTodoId)
          || deletedTodoIds.includes(id))
          && isLoading
          ? 'modal overlay is-active'
          : 'modal overlay'}
      >
        <div
          className="modal-background has-background-white-ter"
        />

        <div className="loader" />
      </div>
    </li>
  );
};
