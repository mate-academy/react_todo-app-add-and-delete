import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  deleting: boolean;
  onDelete: (id: number) => void;
};

export const TodoItem: React.FC<Props> = ({ todo, deleting, onDelete }) => (
  <div className={`todo ${todo.completed ? 'completed' : ''}`} data-cy="Todo">
    <label className="todo__status-label">
      <input
        type="checkbox"
        className="todo__status"
        checked={todo.completed}
        readOnly
        aria-label="Mark todo as completed"
        data-cy="TodoStatus"
      />
    </label>
    <span className="todo__title" data-cy="TodoTitle">
      {todo.title}
    </span>
    <button
      type="button"
      className="todo__remove"
      onClick={() => onDelete(todo.id)}
      disabled={deleting}
      data-cy="TodoDelete"
    >
      ×
    </button>

    <div
      className={`modal overlay ${deleting || todo.id === 0 ? 'is-active' : ''}`}
      data-cy="TodoLoader"
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  </div>
);
