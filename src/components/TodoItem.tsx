import React from 'react';
import { Todo } from '../types/Todo';

interface TodoItemProps {
  todo: Todo;
  onUpdate: (id: number, data: Partial<Todo>) => Promise<void> | void;
  onDelete: (id: number) => Promise<void> | void;
  isTemporary?: boolean;
  isProcessing?: boolean;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onUpdate,
  onDelete,
  isTemporary = false,
  isProcessing = false,
}) => {
  const { id, title, completed } = todo;

  const handleToggle = async () => {
    await onUpdate(id, { completed: !completed });
  };

  const handleDelete = async () => {
    await onDelete(id);
  };

  const showLoader = isTemporary || isProcessing;

  return (
    <div data-cy="Todo" className={`todo ${completed ? 'completed' : ''}`}>
      <label
        className="todo__status-label"
        htmlFor={`todo-status-${id}`}
        aria-label="Toggle todo status"
      >
        <input
          id={`todo-status-${id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleToggle}
          disabled={showLoader}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={handleDelete}
        disabled={showLoader}
      >
        ×
      </button>

      <div
        className={`todo__loader ${showLoader ? 'is-active' : ''}`}
        data-cy="TodoLoader"
      >
        <div className="loader" />
      </div>
    </div>
  );
};
