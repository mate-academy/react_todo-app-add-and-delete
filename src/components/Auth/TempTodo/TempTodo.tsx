import React from 'react';

type Props = {
  tempTodoTitle: string;
};

export const TempTodo: React.FC<Props> = ({ tempTodoTitle }) => (
  <div
    data-cy="Todo"
    className="todo"
  >
    <label className="todo__status-label">
      <input
        data-cy="TodoStatus"
        type="checkbox"
        className="todo__status"
        defaultChecked
      />
    </label>

    <span
      data-cy="TodoTitle"
      className="todo__title"
    >
      {tempTodoTitle}
    </span>

    <button
      type="button"
      className="todo__remove"
      data-cy="TodoDeleteButton"
    >
      ×
    </button>

    <div
      data-cy="TodoLoader"
      className="modal overlay is-active"
    >
      <div
        className="modal-background has-background-white-ter"
      />
      <div className="loader" />
    </div>
  </div>
);
