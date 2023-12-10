import classNames from 'classnames';
import { Todo } from './types/Todo';

type TodoItemProps = {
  todo: Todo;
  deleteTodo: (todoId: number) => void;
  isDeleting?: boolean;
  isLoading: boolean;
  onDoubleClick: () => void;
};

export const TodoItem: React.FC<TodoItemProps> = ({
  todo: { id, completed, title },
  deleteTodo,
  isDeleting,
  isLoading,
  onDoubleClick,
}) => {
  const showLoader = (id === 0 && isLoading) || (isDeleting && isLoading);

  return (
    <div
      data-cy="Todo"
      className={`todo ${completed ? 'completed' : 'active'}`}
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

      <span
        data-cy="TodoTitle"
        className="todo__title"
        onDoubleClick={onDoubleClick}
      >
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => deleteTodo(id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': showLoader,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
