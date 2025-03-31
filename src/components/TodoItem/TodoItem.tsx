/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import React, { FC } from 'react';

interface Props {
  todo: Todo;
  isLoading?: boolean;
  handleDelete: (todoId: number) => void;
  isDeleting: boolean;
}

export const TodoItem: FC<Props> = ({
  todo,
  isLoading,
  handleDelete,
  isDeleting,
}: Props) => {
  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          disabled={isLoading}
          checked={todo.completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDelete(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoading || isDeleting,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
