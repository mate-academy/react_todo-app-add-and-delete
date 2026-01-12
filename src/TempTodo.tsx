import { Todo } from './types/todo';

type Props = {
  todo: Todo;
};

export const TempTodo: React.FC<Props> = ({ todo }) => {
  return (
    <div data-cy="Todo" className="todo">
      <label className="todo__status-label">
        <span className="is-sr-only">Toggle status</span>
        <input data-cy="TodoStatus" type="checkbox" disabled />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      {/* Remove button appears only on hover */}
      <button type="button" className="todo__remove" data-cy="TodoDelete">
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div data-cy="TodoLoader" className="modal overlay is-active">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
