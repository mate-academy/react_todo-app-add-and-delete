import React, { useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  withLoader?: boolean,
  removeTodoOnServer: (id:number) => void,
};

export const TodoItem: React.FC<Props> = (
  { todo, withLoader, removeTodoOnServer },
) => {
  const {
    id,
    title,
    completed,
  } = todo;
  const [hasLoader, setHasLoader] = useState(withLoader);

  const handleClick = () => {
    removeTodoOnServer(id);
    setHasLoader(true);
  };

  return (
    <div
      className={cn('todo', { completed: completed === true })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => {}}
        />
      </label>
      <span className="todo__title">{title}</span>
      <button
        type="button"
        className="todo__remove"
        onClick={handleClick}
      >
        ×
      </button>

      {hasLoader && (
        <div className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </div>
  );
};
