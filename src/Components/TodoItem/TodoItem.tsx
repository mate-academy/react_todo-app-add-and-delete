import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  isSubmiting?: boolean;
  onDelete: (todoId: number) => void;
  deletingIds: number[];
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isSubmiting,
  onDelete,
  deletingIds,
}) => {
  const { completed, title, id } = todo;

  return (
    <div data-cy="Todo" className={classNames('todo', { completed })}>
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

      <div className={classNames('modal overlay', {
        'is-active': isSubmiting || deletingIds.includes(todo.id),
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
