import classNames from 'classnames';
import React from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  onRemove: () => Promise<void>,
  isLoading: boolean,
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  onRemove,
  isLoading,
}) => {
  const handleRemove = async () => {
    await onRemove();
  };

  return (
    <div
      data-cy="Todo"
      className={
        classNames('todo', { completed: todo.completed })
      }
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
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={handleRemove}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay',
          {
            'is-active': isLoading,
          },
        )}

      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
