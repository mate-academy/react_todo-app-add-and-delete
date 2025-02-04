import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  handleDeleteTodo: (todoIds: number[]) => void;
  isLoading: boolean;
  pendingIds: number[];
};

export const TodoItem: React.FC<Props> = ({
  todo: { id, title, completed },
  handleDeleteTodo,
  isLoading,
  pendingIds,
}) => {
  return (
    <div
      data-cy="Todo"
      className={classNames({
        todo: true,
        'item-enter-done': true,
        completed,
      })}
    >
      <label className="todo__status-label" aria-label="Toggle Todo Status">
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
        onClick={() => handleDeleteTodo([id])}
        aria-label="Delete Todo"
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': isLoading || pendingIds.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
