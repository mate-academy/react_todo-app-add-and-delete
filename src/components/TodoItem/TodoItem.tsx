import React from 'react';
import classNames from 'classnames';

type Props = {
  id: number;
  completed: boolean;
  title: string;
  isItemLoading: boolean;
  onItemDelete: (id: number) => void;
  deleteIds: number[];
};
export const TodoItem: React.FC<Props> = ({
  id,
  completed,
  title,
  isItemLoading,
  onItemDelete,
  deleteIds,
}) => {
  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: completed,
        'todo__status-label': !completed,
      })}
      key={id}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onItemDelete(id)}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': isItemLoading && deleteIds.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
