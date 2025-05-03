/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  isProcessing: boolean;
  onDelete: (id: number) => void;
}

export const TodoItem: React.FC<Props> = ({ todo, isProcessing, onDelete }) => (
  <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
    <label className="todo__status-label">
      <input
        data-cy="TodoStatus"
        type="checkbox"
        className="todo__status"
        checked={todo.completed}
        readOnly
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
    >
      ×
    </button>

    <div
      data-cy="TodoLoader"
      className={`modal overlay ${isProcessing ? 'is-active' : ''}`}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  </div>
);
