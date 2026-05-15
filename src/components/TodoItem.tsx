import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isLoading?: boolean;
  onDelete?: (id: number) => void;
  onToggle?: (id: number) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading = false,
  onDelete,
  onToggle,
}) => {
  const { id, title, completed } = todo;

  return (
    <div data-cy="Todo" className={classNames('todo', { completed })}>
      <label
        className="todo__status-label"
        htmlFor={`todo-status-${id}`}
        aria-label={title}
      >
        <input
          id={`todo-status-${id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => onToggle?.(id)}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      <button
        data-cy="TodoDelete"
        type="button"
        className="todo__remove"
        onClick={() => onDelete?.(id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
