import React from 'react';

type Props = {
  todoTitle: string;
};

export const TodoWithLoader: React.FC<Props> = ({ todoTitle }) => (
  <div data-cy="Todo" className="todo">
    <label className="todo__status-label">
      <input
        data-cy="TodoStatus"
        type="checkbox"
        className="todo__status"
      />
    </label>

    <span data-cy="TodoTitle" className="todo__title">
      {todoTitle}
    </span>
    <button
      type="button"
      className="todo__remove"
      data-cy="TodoDeleteButton"
    >
      ×
    </button>

    <div data-cy="TodoLoader" className="modal overlay is-active">
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  </div>
);
