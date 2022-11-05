import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  isProcessed: boolean,
  onDelete?: (id: number) => void,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isProcessed,
  onDelete,
}) => (
  <div
    data-cy="Todo"
    className={classNames(
      'todo', { completed: todo.completed },
    )}
  >
    <label className="todo__status-label">
      <input
        data-cy="TodoStatus"
        type="checkbox"
        className="todo__status"
        defaultChecked={todo.completed}
      />
    </label>

    <span data-cy="TodoTitle" className="todo__title">
      {todo.title}
    </span>

    {onDelete && (
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => onDelete(todo.id)}
      >
        ×
      </button>
    )}

    <div
      data-cy="TodoLoader"
      className={classNames(
        'modal', 'overlay', { 'is-active': isProcessed },
      )}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  </div>
);
