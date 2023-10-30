import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  handleTodoStatusUpdate: (status: boolean, id: Todo['id']) => void;
  onDelete: (todoId: Todo['id']) => void;
};

export const TodoItem: React.FC<Props>
  = ({ todo, handleTodoStatusUpdate, onDelete }) => {
    function handleUpdate() {
      handleTodoStatusUpdate(!todo.completed, todo.id);
    }

    return (
      <div
        data-cy="Todo"
        className={cn('todo', {
          completed: todo.completed === true,
        })}
        key={todo.id}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            onClick={handleUpdate}
            checked={todo.completed}
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          {todo.title}
        </span>
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDelete(todo.id)}
        >
          ×
        </button>

        <div data-cy="TodoLoader" className="modal overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    );
  };
