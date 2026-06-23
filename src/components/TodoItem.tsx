import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  onDelete: (id: number) => void;
  isProcessed?: boolean;
  isLoading?: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  isProcessed,
  isLoading,
}) => {
  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control*/}
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
        onClick={() => onDelete(todo.id)}
        className="todo__remove"
        data-cy="TodoDelete"
      >
        ×
      </button>

      {isProcessed && (
        <div
          data-cy="TodoLoader"
          className={`modal overlay ${isLoading ? 'is-active' : ''}`}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </div>
  );
};
