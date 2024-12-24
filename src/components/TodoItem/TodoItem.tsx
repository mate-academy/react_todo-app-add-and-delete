import { Todo } from '../../types/Todo';
import classNames from 'classnames';

type Props = {
  todo: Todo;
  onToggleStatus: (v: Todo) => void;
  handleDeleteTodo: (v: number) => void;
  isLoading: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onToggleStatus,
  handleDeleteTodo,
  isLoading,
}) => {
  const handleChangeStatus = () => {
    const updatedTodo = { ...todo, completed: !todo.completed };

    onToggleStatus(updatedTodo);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          aria-label="Mark as completed"
          onChange={handleChangeStatus}
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
        onClick={() => handleDeleteTodo(todo.id)}
        disabled={isLoading}
      >
        ×
      </button>

      {/* Overlay for loader during status change */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
