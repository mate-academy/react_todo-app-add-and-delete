import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo;
  loading: boolean;
  onDelete: (id: number) => void;
  onToggle: (todo: Todo) => void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  loading,
  onDelete,
  onToggle,
}) => (
  <li
    className={classNames('todo', { completed: todo.completed })}
    data-cy="Todo"
  >
    <label className="todo__status-label">
      <input
        type="checkbox"
        aria-label="Toggle todo status"
        className="todo__status"
        data-cy="TodoStatus"
        checked={todo.completed}
        onChange={() => onToggle(todo)}
      />
    </label>

    <span data-cy="TodoTitle" className="todo__title">
      {todo.title}
    </span>

    <button
      type="button"
      className="todo__remove"
      data-cy="TodoDelete"
      onClick={() => onDelete(todo.id)}
    >
      ×
    </button>

    <div
      data-cy="TodoLoader"
      className={classNames('modal overlay', { 'is-active': loading })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  </li>
);
