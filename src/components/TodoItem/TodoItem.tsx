import React, { useState } from 'react';
import classNames from 'classnames';

import { deleteTodo } from '../../api/todos';

import { ErrorType } from '../../enums/ErrorType';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  isLoading: boolean;
  onDeleteTodo: (todoId: number) => void;
  showError: (errorType: ErrorType) => void;
  hideError: () => void;
};

export const TodoItem: React.FC<Props> = React.memo(
  ({
    todo,
    isLoading,
    onDeleteTodo,
    showError,
    hideError,
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
          showError(ErrorType.Delete);
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
  },
);
