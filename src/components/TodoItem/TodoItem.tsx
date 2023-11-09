import { Todo } from '../../types/Todo';

type TodoItemProps = {
  todo: Todo;
  isTemporary: boolean;
  onDelete: (todoId: number) => void;
  isDeleting: boolean;
};

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  isTemporary,
  onDelete,
  isDeleting,
}) => {
  // console.log(isDeleting);
  console.log(isTemporary);
  console.log('Rendering TodoItem');

  return (
    <div data-cy="Todo" className="todo">
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          readOnly // no change handler yet
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

      {(isTemporary || isDeleting) && (
        <div data-cy="TodoLoader" className="modal overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </div>
  );
};

// issue with how todo item animations are being handled.
