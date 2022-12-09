import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  isLoading: boolean;
  removeTodoFromServer?: (todoId: number) => void;
}

export const TodoItem: React.FC<Props> = React.memo(({
  todo,
  isLoading,
  removeTodoFromServer,
}) => {
  const {
    title,
    completed,
    id,
  } = todo;

  const handleRemove = () => {
    if (removeTodoFromServer) {
      removeTodoFromServer(id);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed,
      })}
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
        onClick={handleRemove}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
