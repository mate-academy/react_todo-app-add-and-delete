/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import React from 'react';

type TodoItemProps = {
  title: string;
  completed: boolean;
  id: number;
  deleteCurrentTodo: (id: number) => void;
  deleteTodoByID: number | null | undefined;
};

export const TodoItem = ({
  title,
  completed,
  id,
  deleteCurrentTodo,
  deleteTodoByID,
}: TodoItemProps) => {
  const isActive = id === 0 || deleteTodoByID === id;

  return (
    <div
      key={id}
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
    >
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
        onClick={() => deleteCurrentTodo(id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': isActive,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
