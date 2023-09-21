import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type TodoItemProps = {
  todo: Todo;
  loadingId: number[];
  removeTodo: (todoId: number) => void;
};

export const TodoItem: React.FC<TodoItemProps> = ({
  todo: { id, title, completed },
  loadingId,
  removeTodo,
}) => {
  const handleRemoveTodo = () => {
    removeTodo(id);
  };

  return (
    <div className={`todo ${completed ? 'completed' : ''}`}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked
        />
      </label>

      <span className="todo__title">{title}</span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        onClick={handleRemoveTodo}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being updated */}
      <div className={classNames(
        'modal overlay',
        { 'is-active': (loadingId.includes(id)) },
        { 'is-active': (id === 0) },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
