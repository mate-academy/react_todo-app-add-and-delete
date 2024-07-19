/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import React from 'react';

type TodoItemProps = {
  id: number;
  completed: boolean;
  title: string;
  updatedTodosId: number[];
  onRemove: (id: number) => void;
  onTogle: (id: number) => void;
};

export const TodoItem = ({
  id,
  completed,
  title,
  updatedTodosId,
  onRemove,
  onTogle,
}: TodoItemProps) => {
  const isUpdated = () => {
    return id < 0 || updatedTodosId.includes(id);
  };

  return (
    <div data-cy="Todo" className={classNames('todo', { completed })} key={id}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => onTogle(id)}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onRemove(id)}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isUpdated(),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
