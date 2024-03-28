import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  deleteItem: (id: number) => void;
  isUpdating: boolean | undefined;
};

export const TodoItem: React.FC<Props> = ({ todo, deleteItem, isUpdating }) => {
  const { id, title, completed } = todo;

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed,
      })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove hidden"
        data-cy="TodoDelete"
        onClick={() => deleteItem(id)}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('overlay', 'modal', {
          'is-active': isUpdating,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
