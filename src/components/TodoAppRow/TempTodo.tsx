import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
};

export const TempTodo: React.FC<Props> = ({ todo }) => (
  <div
    data-cy="Todo"
    className="todo"
  >
    <label className="todo__status-label">
      <input
        data-cy="TodoStatus"
        type="checkbox"
        className="todo__status"
        checked={todo.completed}
      />
    </label>

    <span
      data-cy="TodoTitle"
      className="todo__title"
    >
      {todo.title}
    </span>

    <button
      type="button"
      className="todo__remove"
      data-cy="TodoDelete"
    >
      ×
    </button>

    <div
      data-cy="TodoLoader"
      className="modal overlay is-active"
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  </div>
);
