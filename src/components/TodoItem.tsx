/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  onDelete?: (todoId: number) => void;
  isProcessed?: boolean;
  onStatusChange?: (todoId: number, newStatus: boolean) => void;
  isLoading?: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo: { id, title, completed },
  onDelete,
  isProcessed,
  onStatusChange,
}) => {
  const handleEdit = () => {
    onStatusChange?.(id, !completed);
  };

  return (
    <div data-cy="Todo" className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleEdit}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      {/* loader or delete button */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isProcessed,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>

      {!isProcessed && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDelete?.(id)}
        >
          ×
        </button>
      )}
    </div>
  );
};
