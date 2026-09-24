import React from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isProcessed: boolean;
  onDelete: (todoId: number) => void;
};

export const TodoItem: React.FC<Props> = ({ todo, isProcessed, onDelete }) => (
  <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
    <label className="todo__status-label">
      <input
        data-cy="TodoStatus"
        type="checkbox"
        className="todo__status"
        checked={todo.completed}
        readOnly
        aria-label="Mark as completed"
      />
    </label>

    <span data-cy="TodoTitle" className="todo__title">
      {todo.title}
    </span>

    <button
      type="button"
      className="todo__remove"
      data-cy="TodoDelete"
      aria-label="Delete"
      onClick={() => onDelete(todo.id)}
    >
      ×
    </button>

    {/* DON'T use conditional rendering to hide the loader */}
    {/* Add the 'is-active' class to show it */}
    <div
      data-cy="TodoLoader"
      className={cn('modal overlay', { 'is-active': isProcessed })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  </div>
);
