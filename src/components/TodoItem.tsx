import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  onDelete: (id: number) => void;
  isLoadingId: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo, onDelete = () => {}, isLoadingId,
}) => {
  return (
    <>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked
        />
      </label>

      <span className="todo__title">
        {todo.title}
      </span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        onClick={() => onDelete(todo.id)}
        disabled={isLoadingId}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being updated  modal */}
      <div className={classNames(
        'modal overlay',
        { 'is-active': isLoadingId },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </>

  );
};
