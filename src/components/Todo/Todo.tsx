import React from 'react';
import classNames from 'classnames';

interface Props {
  title: string,
  id: number,
  completed: boolean,
  handleDelete: (todoId: number) => void,
  selectedTodos: number[],
}

export const Todo: React.FC<Props> = ({
  title,
  id = 0,
  completed,
  handleDelete,
  selectedTodos,
}) => (
  <div
    data-cy="Todo"
    className={classNames('todo', {
      completed,
    })}
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
      onClick={() => handleDelete(id)}
    >
      ×
    </button>

    <div
      data-cy="TodoLoader"
      className={classNames('modal overlay', {
        'is-active': id === 0 || selectedTodos.includes(id),
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  </div>
);
