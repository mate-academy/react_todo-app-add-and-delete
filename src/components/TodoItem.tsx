import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isTempTodo?: boolean;
  isDeleteing?: boolean;
  isClearCompleted?: boolean;
  handleDelete: (id: number) => void;
  todoIdForDelete?: number;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isTempTodo = false,
  isDeleteing = false,
  // isClearCompleted = false,
  handleDelete,
  todoIdForDelete,
}) => {
  const { title, completed, id } = todo;

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDelete(id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isTempTodo || (isDeleteing && todoIdForDelete === id),
          // (isDeleteing && isClearCompleted && completed),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
