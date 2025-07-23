import React from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  onToggle: (id: number) => void;
  isLoading?: boolean;
  onDeleted: (id: number) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onToggle,
  isLoading,
  onDeleted,
}) => {
  return (
    <div data-cy="Todo" className={todo.completed ? 'todo completed' : 'todo'}>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          checked={todo.completed}
          className="todo__status"
          onClick={() => onToggle(todo.id)}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onDeleted(todo.id)}
        disabled={isLoading}
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
