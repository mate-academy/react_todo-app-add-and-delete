import { Todo } from '../../types/Todo';
import classNames from 'classnames';

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
      className={classNames('todo', { completed: todo.completed })}
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
        className={classNames('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export * from './TodoItem';
