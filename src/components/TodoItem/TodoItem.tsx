import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  isLoading: boolean;
  handleDelete: (todoId: number) => void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  handleDelete,
}) => {
  return (
    <div
      data-cy="Todo"
      className={'todo' + (todo.completed ? ' completed' : '')}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo_status"
          aria-label="Toggle todo status"
          checked={todo.completed}
          readOnly
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>
      <button
        type="button"
        className="todo_remove"
        data-cy="TodoDelete"
        onClick={() => handleDelete(todo.id)}
      >
        x
      </button>

      <div
        data-cy="TodoLoader"
        className={'modal overlay' + (isLoading ? ' is-active' : '')}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
