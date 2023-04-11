import { useState, useEffect } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  onDelete: () => void;
  deleting?: boolean
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  onDelete,
  deleting = false,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setIsDeleting(deleting);
  }, [deleting]);

  return (
    <div className={classNames(
      'todo', { completed: todo.completed },
    )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked
        />
      </label>

      <span className="todo__title">{todo.title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => {
          setIsDeleting(true);
          onDelete();
        }}
      >
        ×
      </button>

      <div
        className={classNames(
          'modal overlay',
          { 'is-active': todo.id === 0 || isDeleting },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
