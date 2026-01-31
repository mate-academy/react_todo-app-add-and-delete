import React from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

interface Props {
  todo: Todo;
  onDeleteTodo: (id: number) => void;
  isLoading?: boolean;
}

export const TodoItem: React.FC<Props> = ({
  todo: { completed, title, id },
  onDeleteTodo,
  isLoading = false,
}) => {
  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed, 'is-temp': id === 0 })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          readOnly
          aria-label="Toggle todo status"
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onDeleteTodo?.(id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoading || id === 0,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
