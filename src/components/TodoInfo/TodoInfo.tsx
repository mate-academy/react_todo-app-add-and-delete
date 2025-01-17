/* eslint-disable jsx-a11y/label-has-associated-control */

import React, { useCallback, useState } from 'react';
import classNames from 'classnames';

import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  onDelete?: () => Promise<void>;
  isProcessing?: boolean;
  nodeRef: React.RefObject<HTMLDivElement>;
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  onDelete = async () => {},
  isProcessing = false,
  nodeRef,
}) => {
  const [title, setTitle] = useState(todo.title);
  const [completed] = useState(todo.completed);

  const [isEdible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const deleteTodo = useCallback(() => {
    setIsLoading(true);
    onDelete().catch(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={nodeRef}
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>

      {isEdible ? (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={title}
            onChange={event => setTitle(event.target.value)}
          />
        </form>
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={deleteTodo}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': isLoading || isProcessing,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
