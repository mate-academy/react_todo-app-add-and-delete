/* eslint-disable jsx-a11y/label-has-associated-control */
import { Todo } from '../types/Todo';
import cn from 'classnames';

interface Props {
  todo: Todo;
  isLoading: boolean;
  handleDelete: (id: number) => void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  handleDelete,
}) => {
  const { completed, title, id } = todo;

  return (
    <div data-cy="Todo" className={cn('todo', { completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDelete(id)}
      >
        x
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
