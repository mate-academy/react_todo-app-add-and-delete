/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */

import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface TodoItemProps {
  todo: Todo;
  loading: boolean;
  loadingId?: string | null;
  onToggle: (todo: Todo) => void;
  onDelete: (id: string) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  loading,
  loadingId,
  onToggle,
  onDelete,
}) => (
  <div
    data-cy="Todo"
    className={classNames('todo', { completed: todo.completed })}
  >
    <label htmlFor={`todo-status-${todo.id}`} className="todo__status-label">
      <input
        id={`todo-status-${todo.id}`}
        data-cy="TodoStatus"
        type="checkbox"
        className="todo__status"
        checked={todo.completed}
        disabled={loadingId === String(todo.id)}
        onChange={() => onToggle(todo)}
      />
    </label>

    <span data-cy="TodoTitle" className="todo__title">
      {todo.title}
    </span>

    {/* Remove button appears only on hover */}
    <button
      type="button"
      className="todo__remove"
      data-cy="TodoDelete"
      onClick={() => onDelete(String(todo.id))}
    >
      ×
    </button>

    {/* overlay will cover the todo while it is being deleted or updated */}
    <div
      data-cy="TodoLoader"
      className={classNames('modal', 'overlay', {
        'is-active': loading,
        hidden: !loading,
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  </div>
);
