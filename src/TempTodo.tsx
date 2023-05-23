import React from 'react';
import classNames from 'classnames';
import { Todo } from './types/Todo';

type Props = {
  todo: Todo;
  loadingId: number | null;
};

export const TempTodo: React.FC<Props> = ({
  todo,
  loadingId,
}) => {
  const {
    title,
    completed,
    id,
  } = todo;

  return (
    <div
      className={classNames('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>

      <span className="todo__title">{title}</span>
      {/* Remove button appears only on hover */}
      <button type="button" className="todo__remove">×</button>

      {/* overlay will cover the todo while it is being updated */}
      <div
        className={classNames('modal overlay', {
          'is-active': loadingId === id,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
