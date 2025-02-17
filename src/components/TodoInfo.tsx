/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

interface Props {
  todo: Todo;
  isLoad?: boolean;
  onDelete: (todoId: number) => void;
}

export const TodoInfo: React.FC<Props> = ({
  todo,
  isLoad = false,
  onDelete,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => {
          onDelete(todo.id);
          setIsDeleting(true);
        }}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoad || isDeleting,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
