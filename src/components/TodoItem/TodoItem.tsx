/* eslint-disable jsx-a11y/label-has-associated-control */

import cn from 'classnames';
import React from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  isOverlayActive?: boolean;
  handleDelete?: (value: number) => void;
  handleSwitchStatus?: (value: number) => void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  isOverlayActive = true,
  handleDelete = () => {},
  handleSwitchStatus = () => {},
}) => {
  const { id, completed, title } = todo;
  const placeHolder = true; //цей функціонал буде реалізованно в наступній тасці

  return (
    <div data-cy="Todo" className={cn('todo', { completed: completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => handleSwitchStatus(id)}
        />
      </label>

      {placeHolder ? (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDelete(id)}
          >
            ×
          </button>
        </>
      ) : (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value="Todo is being edited now"
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', {
          'is-active': isOverlayActive,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
