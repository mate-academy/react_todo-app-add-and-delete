import classNames from 'classnames';
import React from 'react';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo;
  isLoading?: boolean;
  onDelete?: (todoId: number) => void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading = false,
  onDelete,
}) => (
  <div
    data-cy="Todo"
    className={classNames('todo', { completed: todo.completed })}
  >
    <label
      className="todo__status-label"
      htmlFor={`todo-status-${todo.id}`}
      aria-label={`Status of ${todo.title}`}
    >
      <input
        data-cy="TodoStatus"
        id={`todo-status-${todo.id}`}
        type="checkbox"
        className="todo__status"
        checked={todo.completed}
        disabled
      />
    </label>

    <span data-cy="TodoTitle" className="todo__title">
      {todo.title}
    </span>

    <button
      type="button"
      className="todo__remove"
      data-cy="TodoDelete"
      aria-label={`Delete ${todo.title}`}
      disabled={isLoading || !onDelete}
      onClick={() => onDelete?.(todo.id)}
    >
      ×
    </button>

    <div
      data-cy="TodoLoader"
      className={classNames('modal overlay', { 'is-active': isLoading })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  </div>
);
