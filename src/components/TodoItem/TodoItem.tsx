import React from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  handleChangeCompleted: (id: number) => void,
  deleteTodo: (id: number) => void,
  deleteTodoId: number,
};

export const TodoItem: React.FC<Props> = ({
  handleChangeCompleted, todo, deleteTodo, deleteTodoId,
}) => {
  const { id, title, completed } = todo;

  return (
    <div
      className={`todo ${completed && ('completed')}`}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => handleChangeCompleted(id)}
        />
      </label>
      <span
        className="todo__title"
      >
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => deleteTodo(id)}
      >
        ×
      </button>

      <div className={`modal overlay ${(!id || deleteTodoId === id) && ('is-active')}`}>
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
