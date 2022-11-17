import classNames from 'classnames';
import React, { useState } from 'react';
import { Todo } from '../types/Todo';
import { removeTodo } from '../api/todos';

type Props = {
  todo: Todo;
  setErrorMessage: (value: string) => void;
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  setErrorMessage,
}) => {
  const { title, completed, id } = todo;
  const [removingStarted, setremovingStarted] = useState(false);

  const handleClick = async () => {
    try {
      setremovingStarted(true);
      await removeTodo(id);
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
      setremovingStarted(false);

      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        {
          'todo completed': completed === true,
        },
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

      <span data-cy="TodoTitle" className="todo__title">{title}</span>
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
          { 'is-active': removingStarted },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
