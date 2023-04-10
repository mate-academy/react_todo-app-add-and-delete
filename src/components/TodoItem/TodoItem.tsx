import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  onDelete: () => void;
  deleting?: boolean;
  todo: Todo;
}

export const TodoItem: React.FC<Props> = ({
  onDelete,
  deleting = false,
  todo,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setIsDeleting(deleting);
  }, [deleting]);

  return (
    <div className={classNames('todo', {
      completed: todo.completed,
    })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
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
