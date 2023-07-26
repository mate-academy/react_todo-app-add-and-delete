import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  onDelete?: () => void;
  isProcessed: boolean;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete = () => {},
  isProcessed,
}) => {
  const { title, completed } = todo;

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
          // checked
        />
      </label>

      <span className="todo__title">{title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => onDelete()}
      >
        ×
      </button>

      <div className={classNames('modal overlay', {
        'is-active': isProcessed,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
