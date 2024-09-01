/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo as TypeTodo } from '../../types/Todo';
import classNames from 'classnames';

type Props = {
  todo: TypeTodo;
  handleDelete: (todoId: number) => void;
  loading: number[];
};

export const Todo: React.FC<Props> = ({ todo, handleDelete, loading }) => {
  const { id, title, completed } = todo;

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
          'is-active': loading.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
