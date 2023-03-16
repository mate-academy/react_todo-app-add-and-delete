import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  isLoader?: boolean,
  removeTodoOnServer: (id: number) => void,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoader,
  removeTodoOnServer,
}) => {
  const {
    id,
    title,
    completed,
  } = todo;
  const [hasLoader, setHasLoader] = useState(isLoader);
  const [updatedTodo, setUpdatedTodo] = useState(todo);

  const handleCheckboxChange = () => {
    const newTodo = { ...updatedTodo, completed: !completed };

    setUpdatedTodo(newTodo);
  };

  const handleClick = () => {
    removeTodoOnServer(id);
    setHasLoader(true);
  };

  return (
    <div
      className={classNames('todo', { completed: completed === true })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleCheckboxChange}
        />
      </label>

      <span className="todo__title">
        {title}
      </span>

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
