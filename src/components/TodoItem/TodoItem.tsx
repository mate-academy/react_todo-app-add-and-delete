import React from 'react';
import cn from 'classnames';

import { Todo } from '../../types';

interface Props {
  todo: Todo;
  isLoading: boolean;
  isSubmitting: boolean;
  onDelete: (todoId: number) => void;
}

export const TodoItem: React.FC<Props> = ({ todo, isLoading, onDelete }) => {
  const { title, id, completed } = todo;

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: completed,
      })}
    >
      {/* eslint-disable jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onDelete(id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
