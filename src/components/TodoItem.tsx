import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isProcessed: boolean;
  onDelete?: () => void;
};

export const TodoItem: React.FC<Props> = ({ todo, isProcessed, onDelete }) => {
  return (
    <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
      <div className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          readOnly
          aria-label={`Mark "${todo.title}" as completed`}
        />
      </div>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={onDelete}
        disabled={isProcessed}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${isProcessed ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
