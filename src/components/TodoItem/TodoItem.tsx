/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';

import { Todo } from '../../types/Todo';
import classNames from 'classnames';

type Props = {
  todo: Todo;
  onToggleTodo: (id: number) => void;
  onDelete: (todoId: number) => void;
  deletingId: number[];
  loading: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onToggleTodo,
  onDelete,
  deletingId,
  loading,
}) => {
  const { id, title, completed } = todo;

  return (
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
          onChange={() => onToggleTodo(id)}
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
        className={classNames('modal overlay', {
          'is-active': deletingId.includes(id) || loading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
