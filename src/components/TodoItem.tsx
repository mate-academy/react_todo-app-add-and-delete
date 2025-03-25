/* eslint-disable react/jsx-filename-extension */
/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo;
  isLoadingTodo: number | null;
  onChange: (todoId: number | undefined, todoCompleted: boolean) => void;
  onDelete: (todoId: number | undefined) => void;
}

const TodoItem: React.FC<Props> = ({
  todo: { id, title, completed },
  isLoadingTodo,
  onChange,
  onDelete,
}) => {
  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
      key={id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          disabled={isLoadingTodo !== null && isLoadingTodo === id}
          onChange={() => onChange(id, !completed)}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        disabled={isLoadingTodo !== null && isLoadingTodo === id}
        onClick={() => onDelete(id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoadingTodo === id,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default TodoItem;
