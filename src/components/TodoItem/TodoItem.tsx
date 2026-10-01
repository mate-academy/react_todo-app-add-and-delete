import React from 'react';
import type Todo from '../../types/Todo';
import cn from 'classnames';

/* eslint-disable react/jsx-filename-extension */

interface Props {
  todo: Todo;
  isLoading?: boolean;
  onDelete: (todoId: number) => void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading = false,
  onDelete,
}) => {
  const { title } = todo;

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          readOnly
        />
        <span className="is-hidden">Todo status</span>
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onDelete(todo.id)}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default TodoItem;
