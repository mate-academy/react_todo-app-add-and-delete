import React from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
}

export const TempTodo: React.FC<Props> = ({ todo: { id, title } }) => (
  <div data-cy="Todo" className="todo">
    <label
      className="todo__status-label"
      htmlFor={`temp-todo-${id}`}
      aria-label="Toggle temp todo status"
    >
      <input
        id={`temp-todo-${id}`}
        type="checkbox"
        className="todo__status"
        checked={false}
        readOnly
      />
    </label>
    <span className="todo__title" data-cy="TodoTitle">
      {title}
    </span>
    <button type="button" className="todo__remove" disabled>
      ×
    </button>
    <div data-cy="TodoLoader" className="modal overlay is-active">
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  </div>
);
