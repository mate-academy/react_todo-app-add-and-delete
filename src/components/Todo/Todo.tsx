import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { ErrorType } from '../../types/ErrorType';
import { removeTodo } from '../../api/todos';

type Props = {
  todo: Todo;
  isLoading: boolean;
  deleteTodo: (todoId: number) => void;
  showError: (errorType: ErrorType) => void;
  hideError: () => void;
};

export const TodoInfo: React.FC<Props> = React.memo(
  ({
    todo,
    isLoading,
    deleteTodo,
    showError,
    hideError,
  }) => {
    const { id, title, completed } = todo;
    const [editTodo] = useState(false);
    const [isWaiting, setIsWaiting] = useState(false);

    function handleDeleteTodo(): void {
      hideError();
      setIsWaiting(true);

      removeTodo(id)
        .then(() => {
          deleteTodo(id);
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

        {editTodo ? (
          <form>
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be   deleted"
              value={todo.title}
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
          <div className="modal-background   has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    );
  },
);
