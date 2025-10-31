import cn from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo;
  handleCompletedChange: (id: number) => void;
  loading?: boolean;
  deleteTodo: (id: number) => void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  handleCompletedChange,
  loading = false,
  deleteTodo,
}) => {
  return (
    <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleCompletedChange(todo.id)}
          disabled={loading}
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
        onClick={() => {
          deleteTodo(todo.id);
        }}
        disabled={loading}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': loading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
