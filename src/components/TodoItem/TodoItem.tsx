/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  isDeleting: boolean;
  onDelete: (id: number) => void;
  isTemp?: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isDeleting,
  onDelete,
  isTemp = false,
}) => {
  return (
    <div
      key={todo.id}
      className={`todo ${todo.completed ? 'completed' : ''} ${isTemp ? 'loading' : ''}`}
      data-cy="Todo"
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          disabled={isTemp}
          readOnly
          data-cy="TodoStatus"
        />
      </label>

      <span className="todo__title" data-cy="TodoTitle">
        {todo.title}
      </span>

      {!isTemp && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDelete(todo.id)}
          disabled={isDeleting}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${isDeleting || isTemp ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
