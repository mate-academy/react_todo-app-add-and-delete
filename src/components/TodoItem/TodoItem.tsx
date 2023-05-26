import cn from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  handleDelete: (todoId: number) => void;
}

export const TodoItem: React.FC<Props> = ({ todo, handleDelete }) => {
  return (
    <div
      className={cn('todo', {
        completed: todo.completed,
      })}
      style={{ position: 'relative' }}
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
        style={{ position: 'absolute' }}
        onClick={() => handleDelete(todo.id)}
      >
        ×
      </button>

      <div className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
