import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo,
  selectedId?: number,
  onDelete?: (id: number) => void,
  loadingClear: boolean,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  selectedId,
  onDelete,
  loadingClear,
}) => {
  const { title, completed, id } = todo;

  const isLoading = id === selectedId
    || (loadingClear && completed);

  return (
    <>
      <div
        data-cy="Todo"
        className={classNames('todo', { completed })}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={completed}
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          {title}
        </span>

        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={onDelete ? () => onDelete(id) : undefined}
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
    </>

  );
};
