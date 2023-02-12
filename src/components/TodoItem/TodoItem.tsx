import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  isProcessed: boolean,
  onDelete?: React.MouseEventHandler<HTMLButtonElement>,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isProcessed,
  onDelete,
}) => {
  return (
    <li
      data-cy="Todo"
      className={classNames(
        'todo',
        { completed: todo.completed },
      )}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          aria-label="input_field"
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          readOnly
          checked={todo.completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        disabled={isProcessed}
        onClick={onDelete}
      >
        ×
      </button>

      <div data-cy="TodoLoader" className="modal overlay">
        <div
          className="
            modal-background
            has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </li>
  );
};
