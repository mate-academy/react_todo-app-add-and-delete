import classNames from 'classnames';

type TodoItemProps = {
  id: number;
  title: string;
  completed: boolean;
  onDelete: (id: number) => void;
  isActive: boolean;
};

export const TodoItem: React.FC<TodoItemProps> = ({
  id,
  title,
  completed,
  onDelete,
  isActive,
}) => {
  return (
    <div data-cy="Todo" className={`todo ${completed && 'completed'}`}>
      {/* eslint-disable jsx-a11y/label-has-associated-control  */}
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

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isActive,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
