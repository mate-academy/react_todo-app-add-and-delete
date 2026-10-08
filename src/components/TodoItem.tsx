import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isLoading: boolean;
  onDelete: (todoId: number) => void;
};

export const TodoItem: React.FC<Props> = ({ todo, isLoading, onDelete }) => (
  <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
    <label className="todo__status-label" htmlFor={`todo-${todo.id}`}>
      <input
        id={`todo-${todo.id}`}
        data-cy="TodoStatus"
        type="checkbox"
        className="todo__status"
        checked={todo.completed}
        aria-label={`Mark ${todo.title} as completed`}
        readOnly
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
      disabled={isLoading}
      onClick={() => onDelete(todo.id)}
    >
      ×
    </button>

    <div
      data-cy="TodoLoader"
      className={`modal overlay ${isLoading ? 'is-active' : ''}`}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  </div>
);
