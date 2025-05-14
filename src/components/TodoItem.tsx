import React from 'react';
import { Todo } from '../types/Todo';

interface TodoItemProps {
  todo: Todo;
  isDeleting: boolean;
  onDelete: (id: number) => void;
  onUpdate: (id: number, completed: boolean) => void;
}

const modalBackgroundClass = 'modal-background has-background-white-ter';

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  isDeleting,
  onDelete,
  onUpdate,
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
          onChange={() => onUpdate(todo.id, !todo.completed)}
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
        className={`modal overlay ${isDeleting ? 'is-active' : ''}`}
      >
        <div className={modalBackgroundClass} />
        <div className="loader" />
      </div>
    </div>
  );
};
