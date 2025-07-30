import React from 'react';
import { Todo } from '../types/Todo';

interface TodoItemProps {
  todo: Todo;
  isLoading?: boolean;
  onDelete?: (id: number) => void;
  onToggle?: (id: number) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  isLoading = false,
  onDelete,
  onToggle,
}) => {
  return (
    <div
      data-cy="Todo"
      className={`todo${todo.completed ? ' completed' : ''}`}
      aria-busy={isLoading}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onToggle && onToggle(todo.id)}
          aria-label={todo.completed ? 'Mark as active' : 'Mark as completed'}
          disabled={isLoading}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        aria-label="Delete todo"
        onClick={() => onDelete && onDelete(todo.id)}
        disabled={isLoading}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={`modal overlay${isLoading ? ' is-active' : ''}`}
        aria-hidden={!isLoading}
        style={{ display: isLoading ? 'block' : 'none' }}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
