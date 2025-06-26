/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

interface TodoItemProps {
  todo: Todo;
  isProcessing: boolean;
  onDelete: (id: number) => void;
  disabled?: boolean;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo: { id, title, completed },
  isProcessing,
  onDelete,
  disabled = false,
}) => (
  <div
    data-cy="Todo"
    className={classNames('todo', {
      completed: completed,
    })}
    key={id}
  >
    <label className="todo__status-label">
      <input
        data-cy="TodoStatus"
        type="checkbox"
        className="todo__status"
        checked={completed}
        readOnly
        disabled={disabled}
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
      disabled={disabled}
    >
      ×
    </button>

    <div
      data-cy="TodoLoader"
      className={classNames('modal', 'overlay', {
        'is-active': isProcessing,
        hidden: !isProcessing,
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  </div>
);
