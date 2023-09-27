import React from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  tempoTodo: Todo;
};

export const TempoTodoItem: React.FC<Props> = ({ tempoTodo }) => (
  <div
    data-cy="Todo"
    className="todo"
  >
    <label className="todo__status-label">
      <input
        data-cy="TodoStatus"
        type="checkbox"
        className="todo__status"
        title="chekbox"
      />
    </label>

    <span
      data-cy="TodoTitle"
      className="todo__title"
    >
      {tempoTodo.title}
    </span>

    <button
      data-cy="TodoDelete"
      type="button"
      className="todo__remove"
    >
      ×
    </button>

    <div
      data-cy="TodoLoader"
      className="modal overlay is-active"
    >
      <div className="modal-background has-background-white-ter" />

      <div className="loader" />
    </div>
  </div>
);
