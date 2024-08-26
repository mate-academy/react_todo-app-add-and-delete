import classNames from 'classnames';
import { Todo } from '../../../types/Todo';

/* eslint-disable jsx-a11y/label-has-associated-control */
type Props = {
  todo: Todo;
  removeTodo: (todoId: number) => void;
  toggleStatus: (todoId: number) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  removeTodo,
  toggleStatus,
}) => {
  return (
    <div
      data-cy="Todo"
      className={classNames('todo', todo.completed ? 'completed' : 'active')}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => {
            toggleStatus(todo.id);
          }}
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
        onClick={() => {
          removeTodo(todo.id);
        }}
      >
        x
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div data-cy="TodoLoader" className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
