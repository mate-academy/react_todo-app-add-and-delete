import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  handleDeletTodo: (deleteTodo: Todo) => void;
  handleChecked: (checkedTodo: Todo) => void;
  loadingIds: number[];
};

export const TodoItem: React.FC<Props> = ({
  todo,
  handleDeletTodo,
  handleChecked,
  loadingIds,
}) => {
  const isLoading = loadingIds.includes(todo.id);

  return (
    <div data-cy="Todo" className={`todo ${todo.completed && 'completed'}`}>
      <label className="todo__status-label">
        <input
          id={`todo-status-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleChecked(todo)}
          aria-label="Toggle todo status"
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
        onClick={() => handleDeletTodo(todo)}
      >
        ×
      </button>
      <div
        data-cy="TodoLoader"
        className={`modal overlay ${(isLoading || todo.id === 0) && 'is-active'}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
      {/* overlay will cover the todo while it is being deleted or updated */}
    </div>
  );
};
