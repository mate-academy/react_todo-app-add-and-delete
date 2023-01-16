import classNames from 'classnames';
import React from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo,
  isAdding?: boolean,
  handleDelete?: (event: React.MouseEvent<HTMLButtonElement>) => void,
  deletedId?: number[] | null,
}

export const TodoItem: React.FC<Props> = ({
  todo,
  isAdding,
  handleDelete,
  deletedId,
}) => {
  const { title, id } = todo;

  return (
    <div data-cy="Todo" className="todo item-enter-done">
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">{title}</span>
      <button
        name={`${id}`}
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={handleDelete}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={
          classNames('modal overlay', {
            'is-active': isAdding
              || deletedId?.find(el => el === id),
          })
        }
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
