import classNames from 'classnames';
import React, { useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo
  isTemp?: boolean;
  onRemove?: (todoId: number) => void
  isDeleting?: boolean
};

export const Todos: React.FC<Props> = ({
  todo,
  isTemp = false,
  onRemove = () => {},
  isDeleting,
}) => {
  const { title, completed, id = 0 } = todo;
  const [isCompleted, setCompleted] = useState(completed);
  const [isEditing] = useState(false);

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        { completed },
      )}
    >

      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={isCompleted}
          onChange={e => setCompleted(e.target.checked)}
        />
      </label>

      {!isEditing
        ? (
          <>
            <span data-cy="TodoTitle" className="todo__title">
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => {
                onRemove(id);
              }}
            >
              ×
            </button>
          </>

        )
        : (
          <form>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              defaultValue={title}
            />
          </form>
        )}

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal',
          'overlay',
          { 'is-active': isTemp || isDeleting },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
