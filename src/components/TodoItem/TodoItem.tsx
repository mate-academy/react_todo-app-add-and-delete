import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  deleteTodoHandler: (id: number) => void;
  loadingIds?: number[];
};

const TodoItem: React.FC<Props> = ({ todo, deleteTodoHandler, loadingIds }) => {
  const deleteBtnHandler = (id: number) => {
    deleteTodoHandler(id);
  };

  return (
    <div
      data-cy="Todo"
      key={todo.id}
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label" htmlFor={`todo-${todo.id}`}>
        <input
          data-cy="TodoStatus"
          type="checkbox"
          id={`todo-${todo.id}`}
          className="todo__status"
          checked={todo.completed}
          readOnly
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
        onClick={() => deleteBtnHandler(todo.id)}
      >
        ×
      </button>

      {/* This form is shown instead of the title and remove button */}
      {false && (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value="Todo is being edited now"
          />
        </form>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': loadingIds && loadingIds.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default TodoItem;
