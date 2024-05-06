import React from 'react';

interface Props {
  id: number;
  title: string;
  completed: boolean;
  onDelete: () => void;
  onToggle: () => void;
}

export const Todo: React.FC<Props> = ({
  id,
  title,
  completed,
  onDelete,
  onToggle,
}) => {
  return (
    <div
      data-cy="Todo"
      data-id={id}
      className={`todo ${completed ? 'completed' : ''}`}
    >
      {/* eslint-disable jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={onToggle}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        onClick={onDelete}
        data-cy="TodoDelete"
      >
        ×
      </button>

      <div data-cy="TodoLoader" className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
