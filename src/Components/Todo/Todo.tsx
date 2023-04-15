import classNames from "classnames";
import { todo } from "../../types/todo";

type Props = {
  todo: todo;
  onDelete: (id: number) => void;
};

export const Todo: React.FC<Props> = ({ todo, onDelete }) => {
  const { completed, title, id } = todo;

  return (
    <div className={classNames("todo", { completed })}>
      <label className="todo__status-label">
        <input type="checkbox" className="todo__status" checked={completed} />
      </label>

      <span className="todo__title">{title}</span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        onClick={() => onDelete(id)}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being updated */}
      <div className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
