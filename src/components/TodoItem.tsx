/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';

type Props = {
  todo: Todo;
  onDelete: (id: number) => void;
  isDeleting?: boolean;
  isLoading?: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  isDeleting = false,
  isLoading = false,
}) => {
  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={`todo ${todo.completed ? 'completed' : ''}`}
    >
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

      {/* Remove button appears only on hover */}
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
        className={cn('modal overlay', {
          'is-active': isDeleting || isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
