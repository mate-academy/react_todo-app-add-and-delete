import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types';

type Props = {
  todo: Todo,
  onDelete: () => void,
  beingProcessed?: boolean,
};

export const TodoItem: React.FC<Props> = React.memo(({
  todo,
  onDelete,
  beingProcessed = false,
}) => {
  const [beingEdited] = useState(false);
  const { title, completed } = todo;

  return (
    <div
      className={classNames(
        'todo',
        { completed },
      )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => {}}
        />
      </label>

      {beingEdited
        ? (
          <form>
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value="Todo is being edited now"
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
              onClick={onDelete}
            >
              ×
            </button>
          </>
        )}

      <div
        className={classNames(
          'modal overlay',
          { 'is-active': beingProcessed },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
