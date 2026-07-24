/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { Todo as TodoType } from '../../types/Todo';

interface Props {
  todo: TodoType;
  isLoading?: boolean;
  onDelete?: (todoId: number) => void;
  onToggle?: (todo: TodoType) => void;
}

export const Todo: React.FC<Props> = ({
  todo,
  isLoading = false,
  onDelete,
  onToggle,
}) => {
  const { id, title, completed } = todo;

  return (
    <div className={`todo ${completed ? 'completed' : ''}`} data-cy="Todo">
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => onToggle?.(todo)}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      {onDelete && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDelete(id)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${isLoading ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
