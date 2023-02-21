import cn from 'classnames';
import React from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  onDelete: () => void,
  toDelete: boolean,
};

export const TodoItem: React.FC<Props> = React.memo(({
  todo,
  onDelete,
  toDelete,
}) => {
  const { title, completed } = todo;

  return (
    <>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>

      <span className="todo__title">{title}</span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        onClick={onDelete}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being updated */}
      <div className={cn('modal overlay', {
        'is-active': toDelete,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </>
  );
});
