import { Todo } from '../../types/Todo';
import classNames from 'classnames';

/* eslint-disable jsx-a11y/label-has-associated-control */
type Props = {
  todo: Todo & { isDeleting?: boolean; isUpdating?: boolean };
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
};

export const TodoItem: React.FC<Props> = ({ todo, onDelete, onToggle }) => {
  const isTemp = todo.id === 0;
  const isLoading = isTemp || todo.isDeleting || todo.isUpdating;

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onDelete(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
