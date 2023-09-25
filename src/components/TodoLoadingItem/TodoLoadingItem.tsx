import React from 'react';
import { TempTodo } from '../../types/TempTodo';

type Props = {
  tempTodo: TempTodo
};

export const TodoLoadingItem: React.FC<Props> = ({ tempTodo }) => {
  const { title } = tempTodo;

  return (
    <div data-cy="Todo" className="todo">
      <label className="todo__status-label">
        <input type="checkbox" className="todo__status" />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>
      <button
        data-cy="TodoDelete"
        type="button"
        className="todo__remove"
      >
        ×
      </button>

      <div data-cy="TodoLoader" className="modal overlay is-active">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
