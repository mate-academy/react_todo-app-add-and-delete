/* eslint-disable jsx-a11y/label-has-associated-control */
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  isDeleting: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onToggle,
  onDelete,
  isDeleting,
}: Props) => {
  return (
    <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onDelete(todo.id)}
      >
        &times;
      </button>

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${isDeleting ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
