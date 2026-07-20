/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isProcessed?: boolean;
  onDelete?: () => void;
};

const modalBackgroundClass = [
  'modal-background',
  'has-background-white-ter',
].join(' ');

export const TodoItem: React.FC<Props> = ({
  todo,
  isProcessed = false,
  onDelete,
}) => {
  const todoClassName = ['todo', todo.completed ? 'completed' : '']
    .filter(Boolean)
    .join(' ');

  const loaderClassName = ['modal', 'overlay', isProcessed ? 'is-active' : '']
    .filter(Boolean)
    .join(' ');

  return (
    <div data-cy="Todo" className={todoClassName}>
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

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={onDelete}
        disabled={isProcessed}
      >
        ×
      </button>

      <div data-cy="TodoLoader" className={loaderClassName}>
        <div className={modalBackgroundClass} />

        <div className="loader" />
      </div>
    </div>
  );
};
