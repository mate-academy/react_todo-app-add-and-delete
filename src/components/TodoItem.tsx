import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isTemp?: boolean;
  isDeleting?: boolean;
  onDelete?: (id: number) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isTemp,
  isDeleting,
  onDelete,
}) => {
  const showLoader = isTemp || isDeleting;

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <div className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          readOnly
        />
      </div>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <div
        data-cy="TodoLoader"
        className={classNames('todo__loader', {
          'is-active': showLoader,
        })}
      ></div>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onDelete?.(todo.id)}
      >
        ×
      </button>
    </div>
  );
};
