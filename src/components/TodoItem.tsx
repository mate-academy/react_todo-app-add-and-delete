import { Todo } from '../types/Todo';
type Props = {
  tod: Todo;
  handleRemoveTodo: (id: number) => void;
};

export const TodoItem: React.FC<Props> = ({
  tod: { id, title, completed },
  handleRemoveTodo,
  isLoading,
  loadingTodoId,
}) => {
  const isDeleting = Array.isArray(loadingTodoId) && loadingTodoId.includes(id);
  const isAdding = isLoading && id === 0;

  return (
    <div
      data-cy="Todo"
      className={completed ? 'todo completed' : 'todo'}
      key={id}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => {}}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => {
          handleRemoveTodo(id);
        }}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${isDeleting || isAdding ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
