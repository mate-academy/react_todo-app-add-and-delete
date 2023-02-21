import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { removeTodo } from '../../api/todos';
import { PossibleError } from '../../types/PossibleError';

type Props = {
  todo: Todo;
  deleteTodo: (todoId: number) => void;
  showError: (possibleError: PossibleError) => void;
  hideError: () => void;
  isLoading: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodo,
  showError,
  hideError,
  isLoading,
}) => {
  const [isEdited] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);

  const { id, title, completed } = todo;

  function handleDeleteTodo(): void {
    hideError();
    setIsWaiting(true);

    removeTodo(id)
      .then(() => {
        deleteTodo(id);
      })
      .catch(() => {
        showError(PossibleError.Delete);
        setIsWaiting(false);
      });
  }

  return (
    <div
      className={classNames('todo',
        { completed })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>

      {isEdited ? (
        <form>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
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
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
