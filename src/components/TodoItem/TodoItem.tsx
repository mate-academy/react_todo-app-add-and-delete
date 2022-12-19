import React, { FC, memo } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo,
  onDelete: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<void>,
  onComplete: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>
}

export const TodoItem: FC<Props> = memo(({
  todo,
  onDelete,
  onComplete,
}) => {
  const { completed, id, title } = todo;

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        { completed },
      )}
    >

      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          value={id}
          onChange={onComplete}
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
        onClick={onDelete}
      >
        x
      </button>

      <div
        data-cy="TodoLoader"
        className="modal overlay"
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
