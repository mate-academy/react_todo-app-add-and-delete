import React from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';

interface Props {
  todo: Todo;
  isProcessed?: boolean;
  onDelete?: (id: number) => void;
  onUpdate?: (todoId: number, data: Partial<Todo>) => void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  isProcessed = false,
  onDelete,
  onUpdate,
}) => {
  const handleCheckboxChange = () => {
    onUpdate?.(todo.id, { completed: !todo.completed });
  };

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
    >
      {/* eslint-disable jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          disabled={isProcessed}
          onChange={handleCheckboxChange}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onDelete?.(todo.id)}
        disabled={isProcessed}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': isProcessed })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
