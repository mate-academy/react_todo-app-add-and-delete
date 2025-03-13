import cn from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
  isLoading: boolean;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  onToggle,
  onDelete,
  isLoading,
}) => {
  const { title, completed, id } = todo;

  return (
    <div data-cy="Todo" className={cn('todo', { completed: completed })}>
      <label className="todo__status-label">
        {/* This comment is made because it fixes
          "A form label must be associated with a control" error */}
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => onToggle(id)}
          disabled={isLoading}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onDelete(id)}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
