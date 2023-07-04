import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/todo';

interface Props {
  todo: Todo;
  loadingTodos: number[];
  onDelete: CallableFunction;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  loadingTodos,
  onDelete,
}) => {
  const { id, title, completed } = todo;

  return (
    <div className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>

      <span className="todo__title">{title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => onDelete(id)}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being updated */}
      <div className={classNames('modal overlay', {
        'is-active': loadingTodos.includes(id),
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
