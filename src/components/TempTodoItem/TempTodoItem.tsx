/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../../types/Todo';

interface TempTodoItemProps {
  todo: Todo;
}

export const TempTodoItem: React.FC<TempTodoItemProps> = ({ todo }) => (
  <div data-cy="Todo" className="todo">
    <label className="todo__status-label">
      <input
        data-cy="TodoStatus"
        type="checkbox"
        className="todo__status"
        checked={todo?.completed}
        disabled
      />
    </label>

    <span data-cy="TodoTitle" className="todo__title">
      {todo?.title}
    </span>

    <button
      type="button"
      className="todo__remove"
      data-cy="TodoDelete"
      disabled
    >
      ×
    </button>

    <div data-cy="TodoLoader" className="modal overlay is-active">
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  </div>
);
