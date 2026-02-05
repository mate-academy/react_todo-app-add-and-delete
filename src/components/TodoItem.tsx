/* eslint-disable jsx-a11y/label-has-associated-control */

import { Todo } from '../types/Todo';
import classNames from 'classnames';
type Props = {
  todo: Todo;
  isProcessing?: boolean;
  onDelete?: () => void;
};

export const TodoItem: React.FC<Props> = ({
  todo: { completed, title, id },
  onDelete,
  isProcessing,
}) => {
  const isTodoLoading = id === 0 || isProcessing;

  function handleDeletClick() {
    onDelete?.();
  }

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
    >
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

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={handleDeletClick}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': isTodoLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
