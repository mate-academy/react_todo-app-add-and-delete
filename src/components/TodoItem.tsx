/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../api/types/Todo';

type Props = {
  todo: Todo;
  isDeleting: boolean;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isDeleting,
  onDelete,
  onToggle,
}) => {
  return (
    // {loadingIds.includes(todo.id) && <Loader />}
    <div
      key={todo.id}
      data-cy="Todo"
      className={`todo ${todo.completed ? 'completed' : ''}`}
    >
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

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onDelete(todo.id)}
        disabled={isDeleting}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${isDeleting ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
