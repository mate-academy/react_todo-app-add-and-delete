import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  filterTodo: Todo[];
  handleDeleteTodo: (todoId: number) => void;
};

export const Todos: React.FC<Props> = ({ filterTodo, handleDeleteTodo }) => {
  return (
    <section className="todoapp__main">
      {filterTodo.map((todo) => (
        <div className={classNames('todo', { completed: todo.completed })}>
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              checked
            />
          </label>

          <span className="todo__title">{todo.title}</span>

          {/* Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            onClick={() => handleDeleteTodo(todo.id)}
          >
            ×
          </button>

          {/* <form>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value="Todo is being edited now"
          />
        </form> */}

          {/* overlay will cover the todo while it is being updated */}
          <div className="modal overlay">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
    </section>
  );
};
