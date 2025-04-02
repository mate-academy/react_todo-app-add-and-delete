/* eslint-disable jsx-a11y/label-has-associated-control */

import { useState } from 'react';
import { Todo } from '../types/Todo';

import classNames from 'classnames';

type Props = {
  todo: Todo;
  onDelete: (todoId: number) => Promise<void>;
};

export const TodoCard: React.FC<Props> = ({ todo, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const isLoading = todo.id === 0 || isDeleting;

  const handleDelete = async () => {
    if (todo.id === 0) {
      return;
    }

    setIsDeleting(true);

    try {
      await onDelete(todo.id);
    } catch (error) {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div
        data-cy="Todo"
        className={classNames('todo', { completed: todo.completed })}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          {todo.title}
        </span>
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={handleDelete}
        >
          ×
        </button>

        <div
          data-cy="TodoLoader"
          className={classNames('modal overlay', { 'is-active': isLoading })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
