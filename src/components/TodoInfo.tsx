import React, { useState } from 'react';
import classNames from 'classnames';
import { deleteTodo } from '../api/todos';
import { Todo } from '../types/Todo';
import { Notifications } from '../types/Notifications';

interface Props {
  todo: Todo,
  setNotification: (value: Notifications) => void,
}

export const TodoInfo: React.FC<Props> = ({ todo, setNotification }) => {
  const {
    title,
    id,
    completed,
  } = todo;
  const [isRemoving, setIsRemoving] = useState(false);

  const handleClick = async () => {
    try {
      setIsRemoving(true);
      await deleteTodo(id);
    } catch (error) {
      setNotification(Notifications.Delete);
      setIsRemoving(false);

      setTimeout(() => {
        setNotification(Notifications.None);
      }, 3000);
    }
  };

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
          defaultChecked
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={handleClick}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay',
          { 'is-active': isRemoving },
        )}
      >
        <div
          className="modal-background has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
};
