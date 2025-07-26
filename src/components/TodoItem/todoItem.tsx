import React from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  onDelete: (id: number) => void;
}

export const TodoItem: React.FC<Props> = ({ todo, onDelete }) => (
  <div className={`todo ${todo.completed ? 'completed' : ''}`} data-cy="Todo">
    <label className="todo__status-label" aria-label="stat">
      <input
        type="checkbox"
        className="todo__status"
        checked={todo.completed}
        readOnly
        data-cy="TodoStatus"
      />
    </label>
    <span className="todo__title" data-cy="TodoTitle">
      {todo.title}
    </span>
    <button
      type="button"
      className="todo__remove"
      onClick={() => onDelete(todo.id)}
      data-cy="TodoDelete"
    >
      ×
    </button>
    <div data-cy="TodoLoader" className="modal overlay">
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  </div>
);
