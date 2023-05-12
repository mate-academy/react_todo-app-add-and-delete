import React, { FC } from 'react';
import { deleteTodo } from '../../api/todos';

interface Props {
  id: number;
  title: string;
  setError: (error: string) => void;
}

export const ActiveTodo: FC<Props> = React.memo(({
  id,
  title,
  setError,
}) => {
  return (
    <div className="todo">
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
        />
      </label>

      <span className="todo__title">{title}</span>
      <button
        type="button"
        className="todo__remove"
        onClick={() => {
          const deletedTodo = deleteTodo(id);

          deletedTodo.catch(() => setError('Unable to delete a todo'));
        }}
      >
        ×
      </button>

      <div className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
