import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { deleteTodos } from '../../api/todos';
import { ErrorMessage } from '../../types/ErrorMessage';

type Props = {
  todo: Todo;
  isLoading: boolean;
  DeleteTodo: (todoId: number) => void;
  showError: (errorType: ErrorMessage) => void;
  hideError: () => void;
};

export const TodoItem: React.FC<Props> = React.memo(({
  todo,
  isLoading,
  DeleteTodo,
  showError,
  hideError,
}) => {
  const [isEdited] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);

  const { title, completed, id } = todo;

  function handleDeleteTodo(): void {
    hideError();
    setIsWaiting(true);

    deleteTodos(id)
      .then(() => {
        DeleteTodo(id);
      })
      .catch(() => {
        showError(ErrorMessage.Delete);
        setIsWaiting(false);
      });
  }

  return (
    <div
      className={classNames('todo', {
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
        className={classNames('modal', 'overlay', {
          'is-active': isLoading || isWaiting,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
