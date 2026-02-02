import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  onToggle?: (todoId: number) => void;
  onTodoRemove?: (todoId: number) => Promise<void>;
  hasTempTodo?: boolean;
  isToDelete?: boolean;
}

const TodoItem = ({
  todo: { id, title, completed },
  onToggle,
  onTodoRemove,
  hasTempTodo = false,
  isToDelete = false,
}: Props) => {
  const handleDelete = (todoId: number) => {
    onTodoRemove?.(todoId);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: completed,
      })}
    >
      <label aria-label="Todo Status" className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => onToggle?.(id)}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDelete(id)}
      >
        {isToDelete ? '···' : '×'}
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': hasTempTodo || isToDelete,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default TodoItem;
