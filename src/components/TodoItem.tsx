import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isTemp?: boolean;
  onDelete: (todoId: number) => void;
  isDeleting?: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo: { completed, id, title },
  isTemp = false,
  onDelete,
  isDeleting,
}) => {
  return (
    <div
      data-cy="Todo"
      className={`todo ${completed ? 'completed' : ''}`}
      key={id}
    >
      <label className="todo__status-label" htmlFor={`todo-status-${id}`}>
        {/* {} */}
        <input
          id={`todo-status-${id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => {
            // тут пізніше буде логіка зміни статусу
          }}
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
        className={`modal overlay ${isTemp || isDeleting ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
