import React from 'react';
import { TempTodo } from '../../types/TempTodo';

type Props = {
  todo: TempTodo | null;
};

export const TemporaryTodo: React.FC<Props> = ({ todo }) => {
  return (
    <div className="todo">
      <label className="todo__status-label">
        <input
          title="status"
          type="checkbox"
          className="todo__status"
        />
      </label>

      <span className="todo__title">{todo?.title}</span>

      <button
        type="button"
        className="todo__remove"
      >
        x
      </button>

      <div className="modal overlay is-active">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
