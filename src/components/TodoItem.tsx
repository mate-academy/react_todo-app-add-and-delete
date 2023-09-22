import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  onDelete: (todoId: number) => void,
  loading: boolean,
};

export const TodoItem: React.FC<Props> = ({ todo, onDelete, loading }) => {
  const handleDeleteClick = () => {
    onDelete(todo.id);
  };

  return (
    <li
      key={todo.id}
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      <span className="todo__title">{todo.title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={handleDeleteClick}
        disabled={loading}
      >
        ×
      </button>

      {loading && (
        <div className="modal overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </li>
  );
};
