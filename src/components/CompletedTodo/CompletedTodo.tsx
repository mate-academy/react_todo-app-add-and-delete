import { FC } from 'react';
import { deleteTodo } from '../../api/todos';

interface Props {
  id: number;
  title: string;
}

export const CompletedTodo: FC<Props> = ({ id, title }) => {
  return (
    <div className="todo completed">
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked
        />
      </label>

      <span className="todo__title">{title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => deleteTodo(id)}
      >
        ×
      </button>

      <div className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
