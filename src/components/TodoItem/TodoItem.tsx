import React, { useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { ErrorMessage } from '../../types/ErrorMessage';
import { deleteTodos } from '../../api/todos';

type Props = {
  todo: Todo;
  isLoading: boolean;
  handleDelete: (todoId: number) => void;
  onShowError: (errorType: ErrorMessage) => void;
  onHideError: () => void;
};

export const TodoItem: React.FC<Props> = React.memo(({
  todo,
  isLoading,
  handleDelete,
  onShowError,
  onHideError,
}) => {
  const [isEdited] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);

  const { title, completed, id } = todo;

  const handleDeleteTodo = () => {
    onHideError();
    setIsWaiting(true);

    deleteTodos(id)
      .then(() => {
        handleDelete(id);
      })
      .catch(() => {
        onShowError(ErrorMessage.Delete);
        setIsWaiting(false);
      });
  };

  return (
    <div
      className={cn('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>

      {isEdited
        ? (
          <form>
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={title}
            />
          </form>
        )
        : (
          <>
            <span className="todo__title">
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              onClick={handleDeleteTodo}
            >
              {'\u00d7'}
            </button>
          </>
        )}

      <div
        className={cn('modal overlay', {
          'is-active': isLoading || isWaiting,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
