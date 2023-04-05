import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { ErrorType } from '../enums/ErrorType';
import { deleteTodo } from '../api/todos';

type Props = {
  todo: Todo;
  showError: (errorType: ErrorType) => void;
  hideError: () => void;
  onDeleteTodo: (todoId: number) => void;
  isLoading: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  showError,
  hideError,
  onDeleteTodo,
}) => {
  const [isWaiting, setIsWaiting] = useState(false);
  const [isEditAllowed] = useState(false);

  const { id, title, completed } = todo;

  function handleDeletingTodo(): void {
    hideError();
    setIsWaiting(true);

    deleteTodo(id)
      .then(() => {
        onDeleteTodo(id);
      })
      .catch(() => {
        showError(ErrorType.delete);
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

      {isEditAllowed ? (
        <form>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={title}
          />
        </form>
      ) : (
        <>
          <span className="todo__title">
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            onClick={handleDeletingTodo}
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
};
