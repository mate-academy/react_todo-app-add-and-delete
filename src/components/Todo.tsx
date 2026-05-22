import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  onDelete: (id: number) => void;
  isProcessed?: boolean;
};

export const TodoCard = ({ todo, onDelete, isProcessed }: Props) => {
  return (
    <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
      <label
        id={`todo-status-label-${todo.id}`}
        htmlFor={`todo-status-${todo.id}`}
        className="todo__status-label"
      >
        <input
          id={`todo-status-${todo.id}`}
          aria-labelledby={`todo-status-label-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          checked={todo.completed}
          readOnly
          className="todo__status"
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

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${isProcessed ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
