import React, { memo } from 'react';
import cN from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  onDelete: (todoId: number) => void
  isLoading?: boolean
};

export const TodoItem: React.FC<Props> = memo(
  ({
    todo,
    onDelete,
    isLoading = true,
  }) => (
    <div
      className={cN('todo', {
        completed: todo.completed,
      })}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          readOnly
        />
      </label>

      <span className="todo__title">{todo.title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => onDelete(todo.id)}
      >
        ×
      </button>

      <div
        className={cN('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  ),
);
