import React from 'react';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo;
  onDelete: (todoId: number) => void;
  isLoading: boolean;
}

export const TodoItem: React.FC<Props> = ({ todo, onDelete, isLoading }) => {
  return (
    <div data-cy="Todo" className={`todo ${todo.completed && 'completed'}`}>
      {/* eslint-disable jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label" htmlFor={`todoStatus-${todo.id}`}>
        <input
          id={`todoStatus-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>
      {/* eslint-enable jsx-a11y/label-has-associated-control */}
      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
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
        className={`modal overlay ${isLoading && 'is-active'}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
