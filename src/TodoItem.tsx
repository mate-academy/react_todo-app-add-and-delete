/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import classNames from 'classnames';
import { Todo } from './types';

interface Props {
  todo: Todo;
  onDelete?: (id: number) => void;
  onToggle?: (id: number) => void;
  isProcessed?: boolean;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  onToggle,
  isProcessed = false,
}) => {
  return (
    <div
      className={classNames('todo', {
        completed: todo.completed,
      })}
      data-cy="Todo"
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onToggle?.(todo.id)}
          disabled={isProcessed}
          data-cy="TodoStatus"
        />
      </label>

      <span className="todo__title" data-cy="TodoTitle">
        {todo.title}
      </span>

      {onDelete && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDelete(todo.id)}
          disabled={isProcessed}
        >
          ×
        </button>
      )}

      <div
        className={classNames('modal', 'overlay', {
          'is-active': isProcessed,
        })}
        data-cy="TodoLoader"
      >
        <div className="modal-background has-background-white-ter" />
        <div className="modal-content">
          <div className="loader" />
        </div>
      </div>
    </div>
  );
};








