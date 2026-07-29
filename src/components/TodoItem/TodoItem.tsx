/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  isLoading?: boolean;
  onDelete: (todoId: number) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading = false,
  onDelete,
}) => {
  return (
    <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
      <label className="todo__status-label" htmlFor={`todo-${todo.id}`}>
        <input
          data-cy="TodoStatus"
          id={`todo-${todo.id}`}
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => {}}
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
        className={`modal overlay ${isLoading ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
