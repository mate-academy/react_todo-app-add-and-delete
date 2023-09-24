import React from 'react';
import classNames from 'classnames';

interface Props {
  id: number,
  completed: boolean,
  title: string,
  deleteItem: (todoId: number) => void,
  isLoading: boolean,
  idToDelete: number,
}

export const TodoItem: React.FC<Props> = ({
  id,
  completed,
  title,
  deleteItem,
  isLoading,
  idToDelete,
}) => {
  return (
    <div
      className={classNames(
        'todo',
        { completed },
      )}
    >
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
        onClick={() => deleteItem(id)}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being updated */}
      <div className={classNames(
        'modal overlay',
        { 'is-active': isLoading && idToDelete === id },
      )}
      >
        <div
          className="modal-background has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
};
