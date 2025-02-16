/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import React from 'react';
import { Todo } from '../types/Todo';

interface TodoItemProps {
  todo: Todo;
  loading: boolean;
  onDelete: (id: number) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  loading,
  onDelete,
}) => {
  const { id, title, completed } = todo;

  return (
    <div className={classNames('todo', { completed })} data-cy="Todo">
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          data-cy="TodoStatus"
          checked={completed}
          readOnly
        />
      </label>
      <span className="todo__title" data-cy="TodoTitle">
        {title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onDelete(id)}
      >
        x
      </button>
      <div className={classNames('modal overlay', { 'is-active': loading })}>
        <div className="modal-background has-background-white-ter"></div>
        <div className="loader"></div>
      </div>
    </div>
  );
};
