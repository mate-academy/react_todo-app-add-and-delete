/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-no-comment-textnodes */
import React from 'react';

import cn from 'classnames';
import { Todo } from '../types/Todo';

type TodoItemProps = {
  todo: Todo;
  loading: boolean;
  processingIds: number[];
  onDelete?: () => void;
};

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  loading,
  onDelete,
  processingIds,
}) => {
  const isProcessing = processingIds.includes(todo.id) || todo.id === 0;
  const shouldShowLoader = isProcessing || loading;

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          disabled={shouldShowLoader}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        disabled={shouldShowLoader}
        onClick={onDelete}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          hidden: !shouldShowLoader,
          'is-active': loading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
