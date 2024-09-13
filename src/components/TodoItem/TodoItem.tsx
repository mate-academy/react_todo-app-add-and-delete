/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState } from 'react';
import { ErrorMessage } from '../../types/ErrorMessage';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { deleteTodo } from '../../api/todos';

type Props = {
  todo: Todo;
  onDelete: (todoId: number) => void;
  isSubmitting?: boolean;
  onSetErrorMessage: (message: ErrorMessage | null) => void;
};

export const TodoItem = ({
  todo,
  onDelete,
  isSubmitting,
  onSetErrorMessage,
}: Props) => {
  const { id, title, completed } = todo;

  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete(todoId: number) {
    setIsDeleting(true);

    try {
      await deleteTodo(todoId);
      onDelete(todoId);
    } catch {
      onSetErrorMessage(ErrorMessage.delete);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div data-cy="Todo" className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={completed}
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
        ×
      </button>
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isSubmitting || isDeleting,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
