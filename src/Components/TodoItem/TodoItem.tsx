import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  isSubmitting?: boolean;
  onDelete: (todoId: number) => void;
  deletingIds: number[];
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isSubmitting,
  onDelete,
  deletingIds,
}) => {
  const { completed, title, id } = todo;

  return (
    <div data-cy="Todo" className={classNames('todo', { completed })}>
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isSubmitting || deletingIds.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>

      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          data-cy="TodoStatus"
          checked={completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">{title}</span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onDelete(id)}
      >
        ×
      </button>
    </div>
  );
};
