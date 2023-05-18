import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  onClose(todoId: number[]): void;
  deletedTodos: number[];
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onClose,
  deletedTodos,
}) => {
  return (
    <div
      className={classNames(
        'todo',
        {
          completed: todo.completed,
        },
      )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      <span className="todo__title">
        {todo.title}
        {todo.id}
      </span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => onClose([todo.id])}
      >
        ×
      </button>

      <div className={classNames('modal', 'overlay', {
        'is-active': todo.id === 0 || deletedTodos.includes(todo.id),
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
