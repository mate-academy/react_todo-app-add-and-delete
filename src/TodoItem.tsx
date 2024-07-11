/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import classNames from 'classnames';
import { Todo } from './types/Todo';

interface Props {
  todo: Todo;
  handleCheck: (id: number) => void;
  deleteTodo: (id: number) => void;
  deletedIds: number[];
}

export const TodoItem: React.FC<Props> = ({
  todo,
  handleCheck,
  deleteTodo,
  deletedIds,
}) => {
  const { id, title, completed } = todo;
  const deletedIdscheck = deletedIds.includes(id);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => handleCheck(id)}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => deleteTodo(id)}
      >
        ×
      </button>

      {/* 'is-active' class puts this modal on top of the todo */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': deletedIdscheck || id === 0,
        })}
      >
        <div
          className="modal-background
        has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
};
