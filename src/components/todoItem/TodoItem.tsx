import React from 'react';
import cn from 'classnames';

interface Props {
  title: string;
  id: number;
  completed: boolean;
  onDelete: (id: number) => void;
  onIsCompletedUpdate: (
    id: number,
    completedCurrVal: boolean,
  ) => void;
  loading: boolean;
  loadingID: number;
}

export const TodoItem: React.FC<Props> = React.memo(({
  title,
  id,
  completed,
  onDelete,
  onIsCompletedUpdate,
  loading,
  loadingID,
}) => {
  return (
    <div className="todo">
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => {
            onIsCompletedUpdate(
              id,
              completed,
            );
          }}
        />
      </label>

      <span className="todo__title">{title}</span>
      <button
        type="button"
        className="todo__remove"
        onClick={() => {
          onDelete(id);
        }}
      >
        ×
      </button>

      <div
        className={cn('modal overlay', {
          'is-active': loading && loadingID === id,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
