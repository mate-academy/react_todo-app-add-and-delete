import React from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  tempoTodo: Todo;
};

export const TempoTodoItem: React.FC<Props> = ({ tempoTodo }) => {
  return (
    <div className="todo">
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          title="chekbox"
        />
      </label>

      <span className="todo__title">{tempoTodo.title}</span>
      <button
        type="button"
        className="todo__remove"
      >
        ×
      </button>
      <div className="modal overlay is-active">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
