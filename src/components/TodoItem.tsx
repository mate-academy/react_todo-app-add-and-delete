/* eslint-disable jsx-a11y/label-has-associated-control */
import cn from 'classnames';
import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isProcessed?: boolean | undefined;
  onDelete?: (todoId: number) => void;
  selectedTodo?: number | null;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete = () => {},
  isProcessed = false,
  selectedTodo,
}) => {
  const { id, title, completed } = todo;
  const loading = isProcessed || selectedTodo === id;

  return (
    <div data-cy="Todo" className={cn('todo', { completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onDelete(id)}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', {
          'is-active': loading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
