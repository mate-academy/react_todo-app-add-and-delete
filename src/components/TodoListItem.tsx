/* eslint-disable jsx-a11y/label-has-associated-control */
import cn from 'classnames';

type Props = {
  id: number;
  title: string;
  completed: boolean;
  onDelete: (id: number) => void;
  isLoading: boolean;
};

export const TodoListItem: React.FC<Props> = ({
  id,
  title,
  completed,
  onDelete,
  isLoading,
}) => {
  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: completed })}
      key={id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
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
