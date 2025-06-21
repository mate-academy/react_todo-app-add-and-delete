import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  deleting: boolean;
  onDelete: () => void;
};

export const TodoItem: React.FC<Props> = ({ todo, deleting, onDelete }) => (
  <div
    data-cy="Todo"
    className={classNames('todo', {
      completed: todo.completed,
      deleting,
    })}
  >
    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
    <label className="todo__status-label">
      <input
        data-cy="TodoStatus"
        type="checkbox"
        className="todo__status"
        checked={todo.completed}
        readOnly
      />
    </label>

    <span data-cy="TodoTitle" className="todo__title">
      {todo.title}
    </span>

    <button
      type="button"
      className="todo__remove"
      data-cy="TodoDelete"
      onClick={onDelete}
    >
      ×
    </button>

    <div
      data-cy="TodoLoader"
      className={classNames('modal overlay', {
        'is-active': deleting,
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  </div>
);
