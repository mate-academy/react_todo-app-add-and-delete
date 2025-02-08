import React from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  isSubmitting?: boolean;
  isDeleting?: Todo;
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  onToggle,
  isSubmitting,
  onDelete,
  isDeleting,
}) => {
  return (
    <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onDelete(todo.id)}
        disabled={isSubmitting}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${isSubmitting || isDeleting?.id === todo.id ? 'is-active' : ''}`}
      >
        <div
          className="modal-background
                  has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
};
