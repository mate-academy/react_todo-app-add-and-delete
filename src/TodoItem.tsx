/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React from 'react';
import classNames from 'classnames';
import { Todo } from './types/Todo';

interface Props {
  todo: Todo;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
  loadingIds: number[];
}

export const TodoItem: React.FC<Props> = ({
  todo: { id, title, completed },
  onDelete,
  onToggle,
  loadingIds = [],
}) => {
  const isLoading = loadingIds.includes(id);

  return (
    <div className={classNames('todo', { completed })} data-cy="Todo">
      <label className="todo__status-label" htmlFor={`todo-${id}`}>
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          id={`todo-${id}`}
          checked={completed}
          onChange={() => onToggle(id)}
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
        disabled={isLoading}
      >
        x
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
