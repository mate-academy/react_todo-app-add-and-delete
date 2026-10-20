import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isLoading: boolean;
  onDelete: (todoId: number) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({ todo, isLoading, onDelete }) => {
  const { id, title, completed } = todo;
  const statusInputId = `todo-status-${id}`;

  return (
    <div data-cy="Todo" className={classNames('todo', { completed })}>
      <label className="todo__status-label" htmlFor={statusInputId}>
        <input
          id={statusInputId}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          aria-label="Mark todo as completed"
          checked={completed}
          disabled
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        aria-label="Delete todo"
        disabled={isLoading}
        onClick={() => {
          void onDelete(id);
        }}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
