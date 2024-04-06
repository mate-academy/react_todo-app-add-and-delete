import React from 'react';
import cn from 'classnames';

interface Props {
  completed: boolean;
  title: string;
  id: number;
  onDelete: (id: number) => void;
  deletingIDs: number[];
}

export const TodoComp: React.FC<Props> = ({
  completed,
  id,
  title,
  onDelete,
  deletingIDs,
}) => (
  <div data-cy="Todo" className={cn('todo', { completed: completed })} key={id}>
    <label aria-label="Todo-status" className="todo__status-label">
      <input
        data-cy="TodoStatus"
        type="checkbox"
        className="todo__status"
        onChange={() => {}}
        checked={completed}
      />
    </label>

    <span data-cy="TodoTitle" className="todo__title">
      {title}
    </span>

    <button
      type="button"
      className="todo__remove"
      data-cy="TodoDelete"
      onClick={() => onDelete(id)}
    >
      ×
    </button>
    <div
      data-cy="TodoLoader"
      className={cn('modal overlay', {
        'is-active': deletingIDs.includes(id),
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  </div>
);
