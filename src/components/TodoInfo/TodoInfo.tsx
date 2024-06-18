/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import React from 'react';

interface Props {
  todoInfo: Todo;
  onDelete: (id: number[]) => void;
  todosForDelete?: number[];
}

export const TodoInfo: React.FC<Props> = ({
  todoInfo,
  onDelete,
  todosForDelete,
}) => {
  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todoInfo.completed,
      })}
      key={todoInfo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todoInfo.completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todoInfo.title}
      </span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => {
          onDelete([todoInfo.id]);
        }}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': todosForDelete?.includes(todoInfo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
