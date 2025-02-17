/* eslint-disable jsx-a11y/label-has-associated-control */

import classNames from 'classnames';
import React from 'react';
import { FC, memo } from 'react';
import { Todo } from '../types';

type Props = {
  isLoading: boolean;
  todo: Todo;
  onDelete?: (id: Todo['id']) => void;
};
export const TodoItem: FC<Props> = memo(
  ({ isLoading, todo: { id, completed, title }, onDelete = () => {} }) => {
    return (
      <div
        key={id}
        data-cy="Todo"
        className={classNames('todo ', {
          completed: completed,
        })}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            id="todoStatus"
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
          onClick={() => onDelete(id)}
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
  },
);

TodoItem.displayName = 'TodoItemMemo';
