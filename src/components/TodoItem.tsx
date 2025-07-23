/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../types/Todo';

interface ItemProps {
  todo: Todo;
  isLoading?: boolean;
  onDelete?: () => void;
}

export const TodoItem: React.FC<ItemProps> = ({
  todo,
  isLoading,
  onDelete,
}) => (
  <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
    <label className="todo__status-label">
      <input
        data-cy="TodoStatus"
        type="checkbox"
        className="todo__status"
        checked={todo.completed}
        disabled={isLoading}
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
      disabled={isLoading}
      onClick={onDelete}
    >
      ×
    </button>

    <div
      data-cy="TodoLoader"
      className={`modal overlay ${isLoading ? 'is-active' : ''}`}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  </div>
);
