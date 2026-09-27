import React from 'react';
import classNames from 'classnames';

import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isDeleting: boolean;
  onDelete: (id: number) => void;
};

export const TodoItem: React.FC<Props> = ({ todo, isDeleting, onDelete }) => (
  <div
    data-cy="Todo"
    className={classNames('todo', { completed: todo.completed })}
  >
    <label className="todo__status-label">
      <input
        data-cy="TodoStatus"
        type="checkbox"
        className="todo__status"
        checked={todo.completed}
        aria-label={`Mark "${todo.title}" as completed`}
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
      onClick={() => onDelete(todo.id)}
      disabled={isDeleting}
    >
      ×
    </button>

    {/*
     * TodoLoader must ALWAYS exist.
     *   normal   : "modal overlay"
     *   deleting : "modal overlay is-active"
     */}
    <div
      data-cy="TodoLoader"
      className={classNames('modal', 'overlay', { 'is-active': isDeleting })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  </div>
);
