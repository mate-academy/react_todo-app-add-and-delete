import React, { useEffect, useState } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

type Props = {
  todo: Todo;
  loading?: boolean;
  deleteTodo?: (todoId: number) => void;
};

export const TodoItem: React.FC<Props> = ({ todo, loading, deleteTodo }) => {
  const { title, completed } = todo;
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (loading) {
      setIsDeleting(false);
    }
  }, [loading]);

  const handleDelete = () => {
    setIsDeleting(true);
    deleteTodo?.(todo.id);
  };

  const isLoading = isDeleting || loading;

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
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
        onClick={handleDelete}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
