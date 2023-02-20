import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  handleDeleteTodo: (todoDelete: Todo) => void,
};

export const TodoInfo: React.FC<Props> = ({ todo, handleDeleteTodo }) => {
  return (
    <div
      className={classNames(
        'todo', { completed: todo.completed },
      )}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      <span className="todo__title">{todo.title}</span>

      {/* {/* This form is shown instead of the title and remove button }
          <form>
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value="Todo is being edited now"
            />
          </form> */}

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        onClick={() => {
          handleDeleteTodo(todo);
        }}
      >
        ×

      </button>

      {/* overlay will cover the todo while it is being updated */}
      <div className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
