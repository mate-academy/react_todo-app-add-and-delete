/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { Todo } from '../types/Todo';

type TodoItemProps = {
  todo: Todo;
  isLoading?: boolean;
  handleDelete?: (id: number) => void;
};

export const TodoItem = ({
  todo,
  isLoading = false,
  handleDelete,
}: TodoItemProps) => {
  return (
    <div data-cy="Todo" className={todo.completed ? 'todo completed' : 'todo'}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          readOnly
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDelete?.(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={isLoading ? 'modal overlay is-active' : 'modal overlay'}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
