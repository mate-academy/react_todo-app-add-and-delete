import React from 'react';
import { Todo } from '../../types/TodoProps';

type ItemProps = {
  todo: Todo;
  isProcessed: boolean;
  isDeleting: boolean;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  isLoading?: boolean;
  deletingTodoId?: number | null;
  dataCy?: string;
};

export const TodoItem: React.FC<ItemProps> = ({
  todo,
  isProcessed,
  isDeleting,
  onToggle,
  onDelete,
  dataCy = 'Todo',
}) => {
  return (
    <div
      data-cy={dataCy}
      className={`todo ${todo.completed ? 'completed' : ''}`}
    >
      <p className="todo__status-label" onClick={() => onToggle(todo.id)}>
        <input
          id={`todo-status-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          readOnly
        />
      </p>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onDelete(todo.id)}
        disabled={isProcessed || isDeleting}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${isDeleting ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" data-cy="Loader" />
      </div>
    </div>
  );
};
