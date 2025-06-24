/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import classNames from 'classnames';

type Props = {
  id: number;
  title: string;
  completed: boolean;
  loadingTodoId: number | null;
  onDelete: (todoId: number) => void;
};

export const TodoItem: React.FC<Props> = ({
  id,
  title,
  completed,
  loadingTodoId,
  onDelete,
}) => (
  <div data-cy="Todo" className={classNames('todo', { completed })}>
    <label className="todo__status-label">
      <input
        data-cy="TodoStatus"
        type="checkbox"
        className="todo__status"
        checked={completed}
      />
    </label>

    <span
      data-cy="TodoTitle"
      className="todo__title"
      style={loadingTodoId === id ? { textDecoration: 'none' } : {}}
    >
      {id === 0 || loadingTodoId !== id ? title : 'Todo is being saved now'}
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
        'is-active': loadingTodoId === id,
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  </div>
);
