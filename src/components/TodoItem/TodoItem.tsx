/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import './TodoItem.scss';
import { clsx } from 'clsx';
import { useState } from 'react';
import { ErrorState } from '../../types/ErrorState';

interface Props {
  todoId: number;
  title: string;
  completed: boolean;
  tempTodo?: true;
  onTodoDelete: (todoId: number) => Promise<void>;
  onError: (error: ErrorState) => void;
  todosToDelete: number[] | null;
}

export const TodoItem = ({
  todoId,
  title,
  completed,
  tempTodo,
  onTodoDelete,
  onError,
  todosToDelete,
}: Props) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleTodoDelete = async () => {
    setIsDeleting(true);

    try {
      await onTodoDelete(todoId);
    } catch {
      onError({
        message: 'Unable to delete a todo',
        isVisible: true,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const willBeDeleted = todosToDelete?.includes(todoId);

  return (
    <div
      data-cy="Todo"
      className={clsx('todo', {
        completed,
      })}
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
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={handleTodoDelete}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={clsx('modal', 'overlay', {
          'is-active': tempTodo || isDeleting || willBeDeleted,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
