import React from 'react';
import { Props } from '../types/Todo';
import classNames from 'classnames';

export const TodoItem: React.FC<Props> = ({ todo, isDeleting = false }) => {
  const isLoading = todo?.id === 0;

  return (
    <>
      <div
        data-cy="Todo"
        className={classNames('todo', { completed: todo?.completed })}
      >
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control*/}
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={todo?.completed}
            readOnly
          />
        </label>
        <span data-cy="TodoTitle" className="todo__title">
          {todo?.title}
        </span>

        {/* overlay will cover the todo while it is being deleted or updated */}
        <div
          data-cy="TodoLoader"
          className={classNames('modal overlay', {
            'is-active': isLoading || isDeleting,
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
