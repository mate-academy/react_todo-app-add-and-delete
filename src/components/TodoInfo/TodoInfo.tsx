import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface P {
  todo: Todo;
  isLoading?: boolean;
  deleteTodo: (id: number) => void;
}

export const TodoInfo: React.FC<P> = ({
  todo,
  isLoading = false,
  deleteTodo,
}) => {
  const { completed, title, id } = todo;
  const handleDeleteTodo = () => {
    deleteTodo(id);
  };

  return (
    <div className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          defaultChecked={completed}
        />
      </label>

      <span className="todo__title">{title}</span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        onClick={handleDeleteTodo}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being updated */}
      <div className={classNames('modal', 'overlay',
        { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
      {
        // #region todoEdited && loading
      }
      {/* This todo is being edited */}
      {/*
      <div className="todo">
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
          />
        </label>

        // This form is shown instead of the title and remove button
        <form>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value="Todo is being edited now"
          />
        </form>

        <div className="modal overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
      */}
      {
        // #endregion
      }
    </div>
  );
};
