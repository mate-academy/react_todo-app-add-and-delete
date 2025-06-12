import React, { useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  isActive?: boolean;
  onDelete?: (todoId: number) => Promise<void>;
  loadingTodoIds?: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isActive,
  onDelete,
  loadingTodoIds,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          aria-label="Mark todo as done"
          checked={todo.completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => {
          if (onDelete) {
            setIsLoading(true);
            onDelete(todo.id).finally(() => setIsLoading(false));
          }
        }}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={`modal overlay ${isActive ? 'is-active' : ''} ${isLoading ? 'is-active' : ''} ${loadingTodoIds ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
