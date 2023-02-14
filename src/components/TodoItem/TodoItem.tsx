import React from 'react';
import classNames from 'classnames';

import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  onRemove: (todoId: number) => void,
  isBeingAdded: boolean,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onRemove,
  isBeingAdded,
}) => {
  const { title, completed, id } = todo;

  return (
    <div className={classNames('todo',
      { completed })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>

      <span className="todo__title">{title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => onRemove(id)}
      >
        ×
      </button>

      <div className={classNames(
        'modal overlay',
        { 'is-active': isBeingAdded },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
