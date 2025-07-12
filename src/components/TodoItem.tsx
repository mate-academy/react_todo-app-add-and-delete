import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isTemp?: boolean;
  isDeleting?: boolean;
  onDelete?: (id: number) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isTemp = false,
  isDeleting = false,
  onDelete,
}) => (
  <div
    data-cy="Todo"
    className={`todo ${todo.completed ? 'completed' : ''} ${isDeleting ? 'is-deleting' : ''}`}
  >
    <label
      className="todo__status-label"
      aria-label={
        todo.completed ? 'Mark todo as not completed' : 'Mark todo as completed'
      }
    >
      <input
        data-cy="TodoStatus"
        type="checkbox"
        className="todo__status"
        checked={todo.completed}
        readOnly
        disabled={isTemp || isDeleting}
      />
    </label>

    <span data-cy="TodoTitle" className="todo__title">
      {todo.title}
    </span>

    <button
      type="button"
      className="todo__remove"
      data-cy="TodoDelete"
      disabled={isTemp || isDeleting}
      onClick={() => onDelete && onDelete(todo.id)}
    >
      ×
    </button>

    <div
      data-cy="TodoLoader"
      className={`todo__loader ${isTemp || isDeleting ? 'is-active' : ''}`}
    >
      <div className="loader" />
    </div>
  </div>
);
